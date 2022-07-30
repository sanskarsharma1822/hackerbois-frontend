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

import { brandsABI } from "../../constants/Brands/brandsConstant.js";
import axios from "../../api/axios.js";
import { useNotification } from "web3uikit";

function Customer() {
  const inWarrenty = true;

  const userRef = useRef();
  const errRef = useRef();
  const dispatch = useNotification();

  const [brandId, setBrandId] = useState("0");
  const [BrandIdFocus, setBrandIdFocus] = useState(false);

  const [productId, setProductId] = useState("0");
  const [productIdFocus, setProductIdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //------------------------------------------------------------------------

  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  // const dispatch = useNotification();
  const chainId = parseInt(chainIdHex);
  const [brandIndex, setBrandIndex] = useState("0");
  const [brandAddress, setBrandAddress] = useState("");
  const [detailURI, setDetailURI] = useState("");
  const [text, setText] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [title, setTitle] = useState("");
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

  const { runContractFunction: getBrandSmartContractAddress } = useWeb3Contract(
    {
      abi: adminABI,
      contractAddress: adminAddress,
      functionName: "getBrandSmartContractAddress",
      params: { index: brandIndex },
    }
  );

  const { runContractFunction: isOwner } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "isOwner",
    params: { _tokenId: productId },
  });

  const { runContractFunction: isNFTDecayed } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "isNFTDecayed",
    params: { _tokenId: productId },
  });

  const { runContractFunction: viewTokenURI } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "viewTokenURI",
    params: { _tokenId: productId },
  });

  const updateUI = async function () {
    if (brandId !== "") {
      const tempIndex = await getBrandIndexFromID({
        onError: (error) => console.log(error),
      });

      setBrandIndex(tempIndex.toString());
    }
  };
  const updateAddress = async function () {
    const tempBrandAddress = (await getBrandSmartContractAddress()).toString();
    setBrandAddress(tempBrandAddress);
  };
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    if (brandIndex !== "0") {
      updateAddress();
    }
    if (brandIndex === "0") {
      setBrandAddress("");
    }
  }, [brandIndex]);

  useEffect(() => {
    if (brandId !== "0") {
      updateUI();
    }
  }, [brandId]);

  useEffect(() => {
    async function updateData() {
      const { data } = await axios.get(`${detailURI}`);
      console.log(data);
      const { name, image, description } = data;
      setTitle(name);
      setImgURL(image);
      setText(description);
    }
    if (detailURI !== "") {
      updateData();
    }
  }, [detailURI]);

  useEffect(() => {
    async function updateURI() {
      const tempURI = await viewTokenURI({
        onError: (error) => console.log(error),
      });
      setDetailURI(tempURI);
    }
    if (success) {
      updateURI();
    }
  }, [success]);
  //------------------------------------------------------------------------

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleIncorrectBrandIdNotification = () => {
    dispatch({
      type: "error",
      title: "Invalid Brand ID",
      position: "topR",
      icon: "info",
    });
  };

  const handleNFTDecayedNotification = () => {
    dispatch({
      type: "error",
      title: "Warranty Has Ended",
      position: "topR",
      icon: "info",
    });
  };

  const handleNotOwnerNotification = () => {
    dispatch({
      type: "error",
      title: "You are not the owner",
      position: "topR",
      icon: "info",
    });
  };

  const handleLoginSuccessNotification = () => {
    dispatch({
      type: "success",
      title: "Login Successful",
      position: "topR",
      icon: "checkmark",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (brandAddress === "") {
        handleIncorrectBrandIdNotification();
        setBrandId("0");
        setBrandIndex("0");
        setProductId("0");
      } else {
        const tempNftDecay = await isNFTDecayed({
          onError: (error) => console.log(error),
        });
        if (tempNftDecay) {
          handleNFTDecayedNotification();
          setBrandId("0");
          setBrandIndex("0");
          setProductId("0");
        } else {
          const tempBool = await isOwner({
            onError: (error) => console.log(error),
          });
          if (tempBool) {
            handleLoginSuccessNotification();
            setSuccess(true);
          } else {
            handleNotOwnerNotification();
            setBrandId("0");
            setBrandIndex("0");
            setProductId("0");
          }
        }
      }
      // }
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
          title={title}
          text={text}
          imgURL={imgURL}
          brandIndex={brandIndex}
          brandId={brandId}
          brandAddress={brandAddress}
          tokenId={productId}
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
            <br></br>
            <br></br>
            <button
              disabled={!brandId || !productId ? true : false}
              // onClick={async () => {
              //   await isOwner({
              //     onError : (error)=>console.log(error)
              //   })
              // }}
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
