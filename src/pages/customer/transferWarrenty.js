import React from "react";
import { useState, useEffect, useRef } from "react";
import "../../forms/register.css";
import storeOwnerHistory from "../../backendScripts/storeOwnerHistory";
import axios from "../../api/axios.js";
import console from "console-browserify";

//------------------------------------------------------------------------------------
import { useMoralis, useWeb3Contract } from "react-moralis";
import { brandsABI } from "../../constants/Brands/brandsConstant";
import {
  adminABI,
  adminContractAddress,
} from "../../constants/Admin/adminConstants";

import { useNotification } from "web3uikit";

//------------------------------------------------------------------------------------

function Transfer({ brandIndex, brandAddress, tokenId }) {
  const userRef = useRef();
  const errRef = useRef();
  const dispatch = useNotification();

  const [newAdd, setNewAdd] = useState("");
  const [newAddFocus, setNewAddFocus] = useState(false);

  const [contact, setContact] = useState("");
  const [ContactFocus, setContactFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //-----------------------------------------------------------
  const [ipfsReturn, setIpfsReturn] = useState("");
  const [ipfsURL, setIpfsUrl] = useState("");
  //-----------------------------------------------------------

  const response = false; //dummy variable

  //----------------------------------------------------
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const adminAddress =
    chainId in adminContractAddress ? adminContractAddress[chainId][0] : null;

  const { runContractFunction: viewhistory } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "viewhistory",
    params: {
      _tokenId: tokenId,
    },
  });

  // const { runContractFunction: setHistory } = useWeb3Contract({
  //   abi: brandsABI,
  //   contractAddress: brandAddress,
  //   functionName: "setHistory",
  //   params: {
  //     _tokenId: tokenId,
  //     _newhistory: ipfsReturn,
  //   },
  // });

  const { runContractFunction: transferToken } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "transferToken",
    params: {
      _sendTo: newAdd,
      _tokenId: tokenId,
      _newHistory: ipfsReturn,
    },
  });

  useEffect(() => {
    async function updateIpfsURL() {
      const tempHistory = await viewhistory({
        onError: (error) => console.log(error),
      });

      setIpfsUrl(tempHistory.toString());
    }

    if (isWeb3Enabled) {
      updateIpfsURL();
    }
  }, []);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNotification(tx);
  };

  const handleNotification = function (tx) {
    dispatch({
      type: "success",
      message: `Warranty transferred to ${newAdd}`,
      title: "Transfer Success",
      position: "topR",
      icon: "bell",
    });
  };

  const transfer = async function () {
    await transferToken({
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
  };

  useEffect(() => {
    console.log("updating");
    async function updateHistory() {
      await transferToken({
        onSuccess: () => {
          console.log("success ipfs");
          // transfer();
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }
    if (ipfsReturn !== "") {
      updateHistory();
    }
  }, [ipfsReturn]);
  //-----------------------------------------------------

  useEffect(() => {
    userRef.current.focus();
  }, []);

  //-----------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateStoreOwner = async () => {
        const tempArr = storeOwnerHistory(ipfsURL, newAdd);
        setIpfsReturn(tempArr);
      };
      updateStoreOwner();
      // if (tempBool) {
      //   // console.log(brandAddress);
      //   // console.log(productId);
      //   setSuccess(true);
      // // } else {
      //   setBrandId("0");
      //   setBrandIndex("0");
      //   setProductId("0");
      // }
    } catch (err) {
      /*if any error in actual res*/
      errRef.current.focus();
    }
  };

  return (
    <div classsName="registerContainer">
      {success ? (
        <h1>transferred</h1>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>New Owner</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="add">New Owner Address:</label>
            <input
              type="text"
              id="add"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setNewAdd(e.target.value)}
              value={newAdd}
              required
              //aria-invalid={validName ? "false" : "true"}
              //aria-describedby="uidnote"
              onFocus={() => setNewAddFocus(true)}
              onBlur={() => setNewAddFocus(false)}
            />
            <label htmlFor="contact">Contact No.:</label>
            <input
              type="number"
              id="contact"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              required
              //aria-invalid={validName ? "false" : "true"}
              //aria-describedby="uidnote"
              onFocus={() => setContactFocus(true)}
              onBlur={() => setContactFocus(false)}
            />
            <button
              disabled={!contact || !newAdd ? true : false}
              // onClick={async () => {
              //   const tempArr = storeOwnerHistory(
              //     // "https://ipfs.moralis.io:2053/ipfs/QmegsBtkjdjicW2RfvgcEH5VehbKwYKDZcKdpEGbxrXR1r",
              //     ipfsURL,
              //     newAdd
              //   );
              //   setIpfsReturn(tempArr);
              //   // console.log(ipfsReturn);
              // }}
            >
              Transfer
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

export default Transfer;
