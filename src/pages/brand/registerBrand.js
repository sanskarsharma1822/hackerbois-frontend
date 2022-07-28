import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../customer/customer.css";
import axios from "../../api/axios.js";
import Warehouse from "./warehouse.js";
import console from "console-browserify";

//Shanky Imports
//-----------------------------------------------------------------------

import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";
import {
  adminABI,
  adminContractAddress,
} from "../../constants/Admin/adminConstants";

import {
  brandFactoryABI,
  brandFactoryContractAddress,
} from "../../constants/BrandFactory/brandFactoryConstants";

//-----------------------------------------------------------------------

const REGISTER_URL = "/register"; //fitting url
function RegisterBrand() {
  const userRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState("");
  const [nameFocus, setNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);

  const [id, setId] = useState("");
  const [idFocus, setIdFocus] = useState(false);

  const [warrenty, setWarrenty] = useState("1");
  // const [warrenty, setWarrenty] = useState("");
  const [warrentyFocus, setWarrentyFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //whenever the thing in the bracket(dependency array) changes this useEffect will be called again
  useEffect(() => {
    userRef.current.focus();
  }, []);

  //name should be a string
  /*useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name])

    //price should be a number
    useEffect(() => {
        setValidPrice(PRICE_REGEX.test(price));
    }, [price])*/

  //if any of the variables change
  useEffect(() => {
    setErrMsg("");
  }, [name, email, id, warrenty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    //const v1 = NAME_REGEX.test(name);
    //const v2 = PRICE_REGEX.test(price);
    /*baki fields ka bhi validation karna hai?
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }*/
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
      setEmail("");
      setId("");
      setWarrenty("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  //------------------------------------------------------------------------------------

  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const dispatch = useNotification();
  const chainId = parseInt(chainIdHex);
  const brandFactoryAddress =
    chainId in brandFactoryContractAddress
      ? brandFactoryContractAddress[chainId][0]
      : null;

  const adminAddress =
    chainId in adminContractAddress ? adminContractAddress[chainId][0] : null;

  const [brandIndex, setBrandIndex] = useState("0");
  const [brandID, setBrandID] = useState("0");
  // const [entryFee, setEntryFee] = useState("0");
  const [entryFee, setEntryFee] = useState("10000000000000000");
  const [smartContractAddress, setSmartContractAddress] = useState("");

  const { runContractFunction: getBrandID } = useWeb3Contract({
    abi: brandFactoryABI,
    contractAddress: brandFactoryAddress,
    functionName: "getBrandID",
    params: { brandAddress: account },
  });

  const { runContractFunction: getEntryFee } = useWeb3Contract({
    abi: brandFactoryABI,
    contractAddress: brandFactoryAddress,
    functionName: "getEntryFee",
    params: { _warrantyPeriod: warrenty },
  });

  const { runContractFunction: deployBrandContract } = useWeb3Contract({
    abi: brandFactoryABI,
    contractAddress: brandFactoryAddress,
    functionName: "deployBrandContract",
    params: {
      _brandID: id,
      _brandOwnerAddress: account,
      _brandName: name,
      _brandEmailAddress: email,
      _warrantyPeriod: warrenty,
    },
    msgValue: entryFee,
  });

  const { runContractFunction: getBrandIndex } = useWeb3Contract({
    abi: adminABI,
    contractAddress: adminAddress,
    functionName: "getBrandIndex",
    params: { brandAdd: account },
  });

  const updateUI = async function () {
    const tempBrandID = await getBrandID({
      onError: (error) => console.log(error),
    });
    const tempIndex = await getBrandIndex({
      onError: (error) => console.log(error),
    });

    setBrandIndex(tempIndex.toString());
    setBrandID(tempBrandID.toString());
    console.log(brandID);
    console.log(brandIndex);
  };

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNotification(tx);
    updateUI();
  };

  const handleNotification = function (tx) {
    dispatch({
      type: "info",
      message: "Transaction Created",
      title: "Brand Created",
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
    async function updateFee() {
      const tempMul = (await getEntryFee()).toString();
      const tempFee = tempMul * 0.01;
      const tempFeeString = tempFee.toString();
      const final = ethers.utils.parseEther(tempFeeString);
      setEntryFee(final.toString());
    }
    updateFee();
  }, [warrenty]);

  //-------------------------------------------------------------------------------------

  return (
    <div classsName="regContainer">
      {/*if registration of product was successful -> go to warehouse */}
      {/* brandID !== 0 && typeof brandID !== "undefined" */}
      {brandID !== "0" && typeof brandID !== "undefined" ? (
        //<Link to='/dh'></Link>
        <Warehouse brandIndex={brandIndex} />
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register Brand</h1>
          {/* <form onSubmit={handleSubmit}> */}
          <label htmlFor="name">Brand Name:</label>
          <input
            type="text"
            id="name"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            //aria-invalid={validName ? "false" : "true"}
            //aria-describedby="uidnote"//wtf is this
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
          />
          {/*<p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
            </p>*/}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            ref={userRef}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            //aria-invalid={validPrice ? "false" : "true"}
            //aria-describedby="pricenote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />
          {/*<p id="pricenote" className={priceFocus && !validPrice ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Price should be a Number 
        </p>*/}
          <label htmlFor="id">Brand ID:</label>
          <input
            type="text"
            id="id"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setId(e.target.value)}
            value={id}
            required
            //aria-invalid={validName ? "false" : "true"}
            //aria-describedby="uidnote"
            onFocus={() => setIdFocus(true)}
            onBlur={() => setIdFocus(false)}
          />
          <label htmlfor="pack">Select a Warrenty Pack:</label>
          <select
            id="pack"
            name="pack"
            onChange={(e) => setWarrenty(e.target.value)}
            value={warrenty}
            required
          >
            <option value="1">30 Days</option>
            <option value="2">60 Days</option>
            <option value="3">90 Days</option>
          </select>
          <button
            disabled={!name || !email || !id || !warrenty ? true : false}
            onClick={async () => {
              // const tempMul = (await getEntryFee()).toString();
              // const tempFee = tempMul * 0.01;
              // const tempFeeString = tempFee.toString();
              // const final = ethers.utils.parseEther(tempFeeString);
              // setEntryFee(final.toString());
              await deployBrandContract({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            Submit
          </button>
          {/* <button
            type="submit"
            onClick={async () => {
              await deployBrandContract({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            Submit
          </button> */}
          {/* </form> */}
        </section>
      )}
    </div>
  );
}

export default RegisterBrand;
