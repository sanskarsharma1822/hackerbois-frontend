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
// import storeData from "../../backendScripts/storeToken";
import console from "console-browserify";
//------------------------------------------------------------------------------------
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import { brandsABI } from "../../constants/Brands/brandsConstant";
import {
  adminABI,
  adminContractAddress,
} from "../../constants/Admin/adminConstants";
import { getSpaceUntilMaxLength } from "@testing-library/user-event/dist/utils";

//------------------------------------------------------------------------------------
const NAME_REGEX = /^[a-zA-Z0-9_.-]*$/;
const PRICE_REGEX = /^[0-9]{1,45}$/;
const REGISTER_URL = "/register"; //fitting url

function AddProduct({ brandIndex, brandAddress, updateTokenCount }) {
  const userRef = useRef();
  const errRef = useRef();
  const dispatch = useNotification();

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

  const [prodWarranty, setProdWarranty] = useState("0");
  const [prodWarrantyFocus, setProdWarrantyFocus] = useState(false);

  //-----------------------------------------------------------
  const [ipfsReturn, setIpfsReturn] = useState(["0", "0"]);

  const [max, setMax] = useState("0");
  //-----------------------------------------------------------

  //----------------------------------------------------
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  // const [brandAddress, setBrandAddress] = useState("");
  const adminAddress =
    chainId in adminContractAddress ? adminContractAddress[chainId][0] : null;

  const [buttonDisabled, setButtonDisabled] = useState(false);

  // const brandIndex = 0;

  // const { runContractFunction: getBrandSmartContractAddress } = useWeb3Contract(
  //   {
  //     abi: adminABI,
  //     contractAddress: adminAddress,
  //     functionName: "getBrandSmartContractAddress",
  //     params: { index: brandIndex },
  //   }
  // );

  const {
    runContractFunction: createCollectible,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "createCollectible",
    params: {
      _tokenURI: ipfsReturn[0],
      _warrantyPeriod: prodWarranty,
      _history: ipfsReturn[1],
    },
  });

  const { runContractFunction: getMaxSupply } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "getMaxSupply",
    params: {},
  });

  const updateUI = async function () {
    // const tempBrandAddress = (await getBrandSmartContractAddress()).toString();
    // setBrandAddress(tempBrandAddress);
  };

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    updateTokenCount();
    setButtonDisabled(false);
    handleNotification(tx);
    // updateUI();
  };

  const handleNotification = function (tx) {
    dispatch({
      type: "success",
      message: "Transaction Successful",
      title: "Product Created",
      position: "topR",
      icon: "bell",
    });
  };

  const handleErrorNotification = function () {
    setButtonDisabled(false);
    dispatch({
      type: "warning",
      message: "Transaction Unsuccessful",
      title: "Error Occurred",
      position: "topR",
      icon: "bell",
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    {
      // console.log(brandAddress);
      // console.log(prodWarranty);
    }
    async function updateCollectible() {
      await createCollectible({
        onSuccess: handleSuccess,
        onError: (error) => {
          console.log(error);
          handleErrorNotification();
        },
      });

      // const temp = await getMaxSupply({
      //   onSuccess: () => console.log("success"),
      //   onError: (error) => console.log(error),
      // });
      // setMax(temp);
    }
    if (ipfsReturn[0] !== "0" && ipfsReturn[1] !== "0") {
      updateCollectible();
    }
  }, [ipfsReturn]);
  //-----------------------------------------------------
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
  }, [name, price, descp, serialNo, prodLink]);

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
      // setImgURL("");
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
    <div classsName="newProd">
      {/* {console.log(max)} */}
      {/* {console.log(ipfsReturn)} */}
      {/* {console.log(brandIndex)}
      {console.log(brandAddress)} */}
      {/* {console.log(max.toString())} */}
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
          {/* <form onSubmit={handleSubmit}> */}
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
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
            className={priceFocus && !validPrice ? "instructions" : "offscreen"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Price should be a Number
          </p>
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
          <label htmlFor="prodWarranty">
            Enter product's warranty in days `Q`:
          </label>
          <input
            type="number"
            id="prodWarranty"
            onChange={(e) => setProdWarranty(e.target.value)}
            value={prodWarranty}
            required
            // aria-invalid={validprodWarranty ? "false" : "true"}
            // aria-describedby="prodWarrantynote"
            onFocus={() => setProdWarrantyFocus(true)}
            onBlur={() => setProdWarrantyFocus(false)}
          />
          <lable htmlfor="myfile">Select Image : </lable>
          <input
            type="file"
            id="myfile"
            name="myfile"
            onChange={(e) => {
              setImgURL(e.target.files);
            }}
          />

          <button
            disabled={
              !validName ||
              !validPrice ||
              isFetching ||
              isLoading ||
              buttonDisabled
                ? true
                : false
            }
            onClick={async () => {
              // return(await login();
              setButtonDisabled(true);
              const tempArr = await storeData(
                name,
                imgURL,
                serialNo,
                prodLink,
                descp,
                price
              );
              // console.log(tempArr[0]);
              // console.log(tempArr[1]);
              setIpfsReturn(tempArr);
            }}
          >
            Register
          </button>
          {/* </form> */}
        </section>
      )}
    </div>
  );
}

export default AddProduct;
