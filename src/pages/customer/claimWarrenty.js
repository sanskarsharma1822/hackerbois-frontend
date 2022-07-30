import React from "react";
import { useState, useEffect, useRef } from "react";
import "./customer.css";
import storeRepairHistory from "../../backendScripts/storeRepairHistory";
import axios from "../../api/axios.js";
import console from "console-browserify";

//------------------------------------------------------------------------------------
import { useMoralis, useWeb3Contract } from "react-moralis";
import { brandsABI } from "../../constants/Brands/brandsConstant";
import { useNotification } from "web3uikit";
import {
  adminABI,
  adminContractAddress,
} from "../../constants/Admin/adminConstants";

//------------------------------------------------------------------------------------

function ClaimWarrenty({ brandIndex, brandAddress, tokenId }) {
  const userRef = useRef();
  const errRef = useRef();
  const dispatch = useNotification();

  const [descp, setDescp] = useState("");
  const [descpFocus, setDescpFocus] = useState(false);
  const response = true;

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //-----------------------------------------------------------
  const [ipfsReturn, setIpfsReturn] = useState("");
  const [ipfsURL, setIpfsUrl] = useState("");
  //-----------------------------------------------------------

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

  const { runContractFunction: setHistory } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "setHistory",
    params: {
      _tokenId: tokenId,
      _newhistory: ipfsReturn,
    },
  });

  // const updateUI = async function () {};

  // useEffect(() => {
  //   if (isWeb3Enabled) {
  //     updateUI();
  //   }
  // }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNotification(tx);
  };

  const handleNotification = function (tx) {
    dispatch({
      type: "success",
      message: "Our Staff Will Contact You Within 24hrs",
      title: "Warranty Claimed",
      position: "topR",
      icon: "checkmark",
    });
  };

  useEffect(() => {
    async function updateHistory() {
      await setHistory({
        onSuccess: handleSuccess,
        onError: (error) => {
          console.log(error);
        },
      });
    }
    if (ipfsReturn !== "") {
      updateHistory();
    }
  }, [ipfsReturn]);

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
  //-----------------------------------------------------
  useEffect(() => {
    userRef.current.focus();
  }, []);

  //------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // if (response == false) {
      //   alert("Problem sending your request  :(");
      // } else if (response == true) {
      //   alert("Query has been sent :)");
      //   setSuccess(true);
      // }

      const tempArr = await storeRepairHistory(ipfsURL, descp, chainId);
      setIpfsReturn(tempArr);

      setDescp("");
    } catch (err) {
      /*if any error in actual res*/
      errRef.current.focus();
    }
  };

  return (
    <div classsName="registerContainer">
      {console.log(ipfsURL)}
      {success ? (
        <h1>We'll let you know if the query was processed</h1>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Claim Warranty</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="descp">Describe your issue:</label>
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
            <button
              disabled={!descp ? true : false}
              // onClick={async () => {
              //   const tempArr = await storeRepairHistory(
              //     // "https://ipfs.moralis.io:2053/ipfs/Qmcev4tRMV6xTpiRm7PGDWpUqKjg39uGaCFfHdJMhbZ1GX",
              //     ipfsURL,
              //     descp
              //   );
              //   console.log(tempArr);
              //   setIpfsReturn(tempArr);
              //   // console.log(ipfsReturn);
              // }}
            >
              Send Request
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

export default ClaimWarrenty;
