import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../customer/customer.css";
import storeData from "../../backendScripts/storeToken";
import axios from "../../api/axios.js";
import storeData from "../../backendScripts/storeToken";

const NAME_REGEX = /^[a-zA-Z0-9_.-]*$/;
const PRICE_REGEX = /^[0-9]{1,45}$/;
const REGISTER_URL = "/register"; //fitting url

function AddProduct() {
  const userRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [price, setPrice] = useState("");
  const [validPrice, setValidPrice] = useState(false);
  const [priceFocus, setPriceFocus] = useState(false);

  const [imgURL, setImgURL] = useState("");
  const [imgURLFocus, setImgURLFocus] = useState(false);

  const [serialNo, setSerialNo] = useState("");
  const [snoFocus, setSnoFocus] = useState(false);

  const [prodLink, setProdLink] = useState("");
  const [prodLinkFocus, setProdLinkFocus] = useState(false);

  const [descp, setDescp] = useState("");
  const [descpFocus, setDescpFocus] = useState(false);

  const [tokenId, setTokenId] = useState("");
  const [tokenFocus, setTokenFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //-----------------------------------------------------------
  const [ipfsReturn, setIpfsReturn] = useState([]);
  //-----------------------------------------------------------

  //whenever the thing in the bracket(dependency array) changes this useEffect will be called again
  useEffect(() => {
    userRef.current.focus();
  }, []);

  //name should be a string
  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
  }, [name]);

  //price should be a number
  useEffect(() => {
    setValidPrice(PRICE_REGEX.test(price));
  }, [price]);

  //if any of the variables change
  useEffect(() => {
    setErrMsg("");
  }, [name, price, descp, imgURL, serialNo, prodLink, tokenId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = NAME_REGEX.test(name);
    const v2 = PRICE_REGEX.test(price);
    //baki fields ka bhi validation karna hai?
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      setSuccess(true);
      /*const response = await axios.post(REGISTER_URL,
                JSON.stringify({ name: name, price: price, descp: descp, imgURL:imgURL, serialNo: serialNo, prodLink:prodLink, tokenId:tokenId}), //backend expects: state name here
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);*/
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setName("");
      setPrice("");
      setImgURL("");
      setSerialNo("");
      setProdLink("");
      setTokenId("");
      setDescp("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div classsName="registerContainer">
      {/*if registration of product was successful -> go to warehouse */}
      {success ? (
        //send info to db
        window.location.reload()
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register New Product</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote" //wtf is this
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
            />
            <p
              id="uidnote"
              className={
                nameFocus && name && !validName ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
              aria-invalid={validPrice ? "false" : "true"}
              aria-describedby="pricenote"
              onFocus={() => setPriceFocus(true)}
              onBlur={() => setPriceFocus(false)}
            />
            <p
              id="pricenote"
              className={
                priceFocus && !validPrice ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Price should be a Number
            </p>
            <label htmlFor="imgurl">Image URL:</label>
            <input
              type="text" //attach img/ look for it in sys
              id="imgurl"
              onChange={(e) => setImgURL(e.target.value)}
              value={imgURL}
              required
              //aria-invalid={validMatch ? "false" : "true"}
              //aria-describedby="confirmnote"
              onFocus={() => setImgURLFocus(true)}
              onBlur={() => setImgURLFocus(false)}
            />
            <label htmlFor="serialNo">Serial No.:</label>
            <input
              type="text"
              id="serialNo"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setSerialNo(e.target.value)}
              value={serialNo}
              required
              //aria-invalid={validName ? "false" : "true"}
              //aria-describedby="uidnote"
              onFocus={() => setSnoFocus(true)}
              onBlur={() => setSnoFocus(false)}
            />
            <label htmlFor="prodLink">Product Link on Flipkart:</label>
            <input
              type="text"
              id="prodLink"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setProdLink(e.target.value)}
              value={prodLink}
              required
              //aria-invalid={validName ? "false" : "true"}
              //aria-describedby="uidnote"
              onFocus={() => setProdLinkFocus(true)}
              onBlur={() => setProdLinkFocus(false)}
            />
            <label htmlFor="descp">Description:</label>
            <input
              type="text"
              id="descp"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setDescp(e.target.value)}
              value={descp}
              required
              //aria-invalid={validName ? "false" : "true"}
              //aria-describedby="uidnote"
              onFocus={() => setDescpFocus(true)}
              onBlur={() => setDescpFocus(false)}
            />
            <label htmlFor="tokenid">Token Id:</label>
            <input
              type="text"
              id="tokenid"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setTokenId(e.target.value)}
              value={tokenId}
              required
              //aria-invalid={validName ? "false" : "true"}
              //aria-describedby="uidnote"
              onFocus={() => setTokenFocus(true)}
              onBlur={() => setTokenFocus(false)}
            />
            <button
              disabled={!validName || !validPrice ? true : false}
              onClick={async () => {
                const tempArr = storeData(
                  name,
                  imageURL,
                  serialNo,
                  prodLink,
                  descp,
                  price
                );
                setIpfsReturn(tempArr);
                console.log(ipfsReturn[0]);
                console.log(ipfsReturn[1]);
              }}
            >
              Register
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

export default AddProduct;
