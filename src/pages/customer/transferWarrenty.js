import React from "react";
import { useState, useEffect, useRef } from "react";
import "../../forms/register.css";
import storeOwnerHistory from "../../backendScripts/storeOwnerHistory";
import axios from "../../api/axios.js";

//------------------------------------------------------------------------------------
import { useMoralis, useWeb3Contract } from "react-moralis";
import { brandsABI } from "../../constants/Brands/brandsConstant";
import {
  adminABI,
  adminContractAddress,
} from "../../constants/Admin/adminConstants";

//------------------------------------------------------------------------------------

function Transfer() {
  const userRef = useRef();
  const errRef = useRef();

  const [newAdd, setNewAdd] = useState("");
  const [newAddFocus, setNewAddFocus] = useState(false);

  const [contact, setContact] = useState("");
  const [ContactFocus, setContactFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //-----------------------------------------------------------
  const [ipfsReturn, setIpfsReturn] = useState();
  const [ipfsURL, setIpfsUrl] = useState();
  //-----------------------------------------------------------

  const response = false; //dummy variable

  //----------------------------------------------------
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [brandAddress, setBrandAddress] = useState("");
  const adminAddress =
    chainId in adminContractAddress ? adminContractAddress[chainId][0] : null;
  // const brandIndex = 0;

  //***********************************************************************************8 */

  // const { runContractFunction: getBrandSmartContractAddress } = useWeb3Contract(
  //   {
  //     abi: adminABI,
  //     contractAddress: adminAddress,
  //     functionName: "getBrandSmartContractAddress",
  //     params: { index: brandIndex },
  //   }
  // );

  const { runContractFunction: viewHistory } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "viewHistory",
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
      _newHistory: ipfsReturn,
    },
  });

  const updateUI = async function () {
    const tempBrandAddress = (await getBrandSmartContractAddress()).toString();
    setBrandAddress(tempBrandAddress);
    // console.log(tempAdd);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    {
      console.log(brandAddress);
      console.log(tokenId);
    }
    async function updateHistory() {
      await setHistory({
        onSuccess: () => console.log("success"),
        onError: (error) => {
          console.log(error);
        },
      });
    }
    updateHistory();
  }, [ipfsReturn]);
  //-----------------------------------------------------

  useEffect(() => {
    userRef.current.focus();
  }, []);

  //-----------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (response == false) {
        alert("Transfer was not a  :(");
      } else if (response == true) {
        alert("Transfer was a Success :)");
        setSuccess(true);
      }
      setNewAdd("");
      setContact("");
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
              onClick={async () => {
                const tempArr = storeOwnerHistory(
                  // "https://ipfs.moralis.io:2053/ipfs/QmegsBtkjdjicW2RfvgcEH5VehbKwYKDZcKdpEGbxrXR1r",
                  ipfsURL,
                  newAdd
                );
                setIpfsReturn(tempArr);
                // console.log(ipfsReturn);
              }}
            >
              Transfer
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              {/*put router link here*/}
              <a href="#">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </div>
  );
}

export default Transfer;
