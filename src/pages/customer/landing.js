import React from "react";
import { useState, useEffect, useRef } from "react";
import ViewProduct from "./viewProduct.js";
import "./customer.css";

import { useMoralis, useWeb3Contract } from "react-moralis";
import console from "console-browserify";

import {
  adminABI,
  adminContractAddress,
} from "../../constants/Admin/adminConstants";

function Customer() {
  const actualAccountOwner = "0x726fA710e16d31b0Db81741fc1e97b70234a779a";
  const currentAccount = "0x726fA710e16d31b0Db81741fc1e97b70234a779a";
  const inWarrenty = true;

  const userRef = useRef();
  const errRef = useRef();

  const [brandId, setBrandId] = useState("0");
  const [BrandIdFocus, setBrandIdFocus] = useState(false);

  const [productId, setProductId] = useState("");
  const [productIdFocus, setProductIdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //------------------------------------------------------------------------

  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  // const dispatch = useNotification();
  const chainId = parseInt(chainIdHex);
  const [brandIndex, setBrandIndex] = useState("0");
  // const brandFactoryAddress =
  //   chainId in brandFactoryContractAddress
  //     ? brandFactoryContractAddress[chainId][0]
  //     : null;

  const adminAddress =
    chainId in adminContractAddress ? adminContractAddress[chainId][0] : null;

  const { runContractFunction: getBrandIndexFromID } = useWeb3Contract({
    abi: adminABI,
    contractAddress: adminAddress,
    functionName: "getBrandIndexFromID",
    params: { id: brandId },
  });

  const updateUI = async function () {
    const tempIndex = await getBrandIndexFromID({
      onError: (error) => console.log(error),
    });

    setBrandIndex(tempIndex.toString());
  };
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  //------------------------------------------------------------------------

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //get response  (actual owner address and warrenty period)
      if (actualAccountOwner != currentAccount) {
        alert("You are not the owner");
      } else if (inWarrenty == false) {
        alert("You are the Owner! But Warrenty has expired");
      }
      //alert("You are the Owner! But Warrenty has expired")
      if (actualAccountOwner == currentAccount && inWarrenty) setSuccess(true);
      setBrandId("");
      setProductId("");
    } catch (err) {
      /*
      /*if (!err?.response) {
        setErrMsg('No Server Response');
      } else {
        setErrMsg('Registration Failed')
      }*/
      errRef.current.focus();
    }
  };

  return (
    <div className="registerContainer">
      {/*if token id was correct -> show product */}
      {success ? (
        //<Link to='/dh'></Link>
        <ViewProduct
          title="My Product"
          text="Describe the product"
          imgURL=""
          index={brandIndex}
        />
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Check Ownership</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="brandid">Brand ID:</label>
            <input
              type="text"
              id="brandid"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setBrandId(e.target.value)}
              value={brandId}
              required
              //aria-invalid={validName ? "false" : "true"}
              //aria-describedby="uidnote"
              onFocus={() => setBrandIdFocus(true)}
              onBlur={() => setBrandIdFocus(false)}
            />
            <label htmlFor="productid">Product ID:</label>
            <input
              type="text"
              id="productid"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setProductId(e.target.value)}
              value={productId}
              required
              //aria-invalid={validName ? "false" : "true"}
              //aria-describedby="uidnote"
              onFocus={() => setProductIdFocus(true)}
              onBlur={() => setProductIdFocus(false)}
            />
            <button
              disabled={!brandId || !productId ? true : false}
              onClick={async () => {
                updateUI();
              }}
            >
              Check
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

export default Customer;
