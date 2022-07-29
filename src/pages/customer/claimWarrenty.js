import React from "react";
import { useState, useEffect, useRef } from "react";
import "./customer.css";
import storeRepairHistory from "../../backendScripts/storeRepairHistory";
import axios from "../../api/axios.js";
import console from "console-browserify";

//------------------------------------------------------------------------------------
import { useMoralis, useWeb3Contract } from "react-moralis";
import { brandsABI } from "../../constants/Brands/brandsConstant";
import {
  adminABI,
  adminContractAddress,
} from "../../constants/Admin/adminConstants";

//------------------------------------------------------------------------------------

function ClaimWarrenty() {
  const userRef = useRef();
  const errRef = useRef();

  const [descp, setDescp] = useState("");
  const [descpFocus, setDescpFocus] = useState(false);
  const response = true;

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //-----------------------------------------------------------
  const [ipfsReturn, setIpfsReturn] = useState();
  const ipfsURL = "";
  //-----------------------------------------------------------

  //----------------------------------------------------
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [brandAddress, setBrandAddress] = useState("");
  const adminAddress =
    chainId in adminContractAddress ? adminContractAddress[chainId][0] : null;

  const brandIndex = 0;
  const { runContractFunction: getBrandSmartContractAddress } = useWeb3Contract(
    {
      abi: adminABI,
      contractAddress: adminAddress,
      functionName: "getBrandSmartContractAddress",
      params: { index: brandIndex },
    }
  );

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

  //------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (response == false) {
        alert("Problem sending your request  :(");
      } else if (response == true) {
        alert("Query has been sent :)");
        setSuccess(true);
      }
      setDescp("");
    } catch (err) {
      /*if any error in actual res*/
      errRef.current.focus();
    }
  };

  return (
    <div classsName="registerContainer">
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
          <h1>Claim Warrenty</h1>
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
              onClick={async () => {
                const tempArr = await storeRepairHistory(
                  // "https://ipfs.moralis.io:2053/ipfs/Qmcev4tRMV6xTpiRm7PGDWpUqKjg39uGaCFfHdJMhbZ1GX",
                  ipfsURL,
                  descp
                );
                console.log(tempArr);
                setIpfsReturn(tempArr);
                // console.log(ipfsReturn);
              }}
            >
              Send Request
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

export default ClaimWarrenty;
