import React, { useState, useEffect } from "react";
import Product from "./eachProduct.js";
import "./brand.css";
import axios from "axios";
import AddProduct from "./addProduct.js";
import console from "console-browserify";

//------------------------------------------------------
import { useMoralis, useWeb3Contract } from "react-moralis";
import { brandsABI } from "../../constants/Brands/brandsConstant";
import {
  adminABI,
  adminContractAddress,
} from "../../constants/Admin/adminConstants";

import { ethers } from "ethers";
import { Moralis } from "moralis";
//------------------------------------------------------

function Warehouse({ brandIndex }) {
  const [products, setProducts] = useState({ items: [] });
  const [showForm, setShowForm] = useState(false);

  //------------------------------------------------------

  const [warrantyAdded, setWarrantyAdded] = useState("1");
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [brandAddress, setBrandAddress] = useState("");
  const [entryFee, setEntryFee] = useState("10000000000000000");
  const [brandWarrantyLeft, setBrandWarrantyLeft] = useState("0");
  const [totalTokens, setTotalTokens] = useState("0");
  const [numOfTokens, setNumOfTokens] = useState("0");
  const [tokens, setTokens] = useState("");
  const [i, setI] = useState(0);
  const [finalArr, setFinalArr] = useState([]);

  const adminAddress =
    chainId in adminContractAddress ? adminContractAddress[chainId][0] : null;

  // const demoArr = [
  //   "https://ipfs.moralis.io:2053/ipfs/QmeHhwna4RP3yeZPVnvy5afiE8oQWdqcSg4nk5ri2YV5rp",
  //   "https://ipfs.moralis.io:2053/ipfs/QmZb67tABujYUXqpZxtq1eM68bu6heo6gsZgVGsyCn7bq6",
  //   "https://ipfs.moralis.io:2053/ipfs/QmbH75rznJ2cpMxdJYUVsC8eNjxjUfNthw1WGPZDWrAcKZ",
  //   "https://ipfs.moralis.io:2053/ipfs/QmZtt24dm1YYPoYkvjW2gwM1pWrxeMCwekrLGdioTeY5C9",
  // ];

  //------------------------------------------------------

  /*useEffect(() => {
        const fetchProductsList = async () => {
            const { data } = await axios("https://jsonplaceholder.typicode.com/photos");
            setProducts({ items: data });
            console.log(data);
        }
        fetchProductsList();
    }, [setProducts])*/

  const { runContractFunction: getBrandSmartContractAddress } = useWeb3Contract(
    {
      abi: adminABI,
      contractAddress: adminAddress,
      functionName: "getBrandSmartContractAddress",
      params: { index: brandIndex },
    }
  );

  const { runContractFunction: getEntryFee } = useWeb3Contract({
    abi: adminABI,
    contractAddress: adminAddress,
    functionName: "getEntryFee",
    params: { warrantyPackIndex: warrantyAdded },
  });

  const { runContractFunction: extendWarranty } = useWeb3Contract({
    abi: adminABI,
    contractAddress: adminAddress,
    functionName: "extendWarranty",
    params: { _brandAdd: account, _warrantyIndex: warrantyAdded },
    msgValue: entryFee,
  });

  const { runContractFunction: getBrandWarrantyLeft } = useWeb3Contract({
    abi: adminABI,
    contractAddress: adminAddress,
    functionName: "getBrandWarrantyLeft",
    params: { index: brandIndex },
  });

  const { runContractFunction: getTotalySupply } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "getTotalySupply",
    params: {},
  });

  const { runContractFunction: viewTokenURI } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "viewTokenURI",
    params: { _tokenId: i - 1 },
  });

  const updateNumberOfTokens = async function () {
    console.log("Updating no of tokens");
    const tempNumberOfTokens = await getTotalySupply({
      onError: (error) => console.log(error),
    });
    setNumOfTokens(tempNumberOfTokens.toString());
  };

  const tokensCondition = () => {
    if (i < numOfTokens) {
      setI(i + 1);
    }
  };

  const updateURI = async function () {
    const tempURI = await viewTokenURI({
      onError: (error) => console.log(error),
    });
    // console.log(tempURI);
    const { data } = await axios.get(`${tempURI}`);
    const { name, image, serialNumber, productLink, description, price } = data;
    const tempObj = {
      tokenId: i - 1,
      name: name,
      image: image,
      serialNumber: serialNumber,
      productLink: productLink,
      description: description,
      price: price,
    };
    setFinalArr((oldArr) => [...oldArr, tempObj]);
  };

  useEffect(() => {
    // console.log("this is i : " + i);
    if (brandAddress !== "") {
      updateURI();
    }
    tokensCondition();
  }, [i]);

  useEffect(() => {
    // console.log("hello ji" + " " + numOfTokens);
    tokensCondition();
  }, [numOfTokens]);

  useEffect(() => {
    if (brandAddress !== "") {
      updateNumberOfTokens();
    }
  }, [brandAddress]);

  const updateUI = async function () {
    const tempBrandWarrantyLeft = (await getBrandWarrantyLeft()).toString();
    // const tempSupply = (await totalSupply()).toString();
    setBrandWarrantyLeft(tempBrandWarrantyLeft);
    // setTotalTokens(tempSupply);
    // if(totalTokens>0){
    //   updateCards();
    // }
    // updateCards();
    // while (currToken < 4) {
    //   console.log(currToken);
    //   setCurrToken(currToken++);
    // }
    // console.log(tempAdd);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    async function updateFee() {
      // console.log(warrantyAdded);
      const tempMul = (await getEntryFee()).toString();
      const tempFee = tempMul * 0.01;
      const tempFeeString = tempFee.toString();
      const final = ethers.utils.parseEther(tempFeeString);
      // console.log(final.toString());
      setEntryFee(final.toString());
    }
    updateFee();
  }, [warrantyAdded]);

  useEffect(() => {
    async function updateAddress() {
      const tempBrandAddress = (
        await getBrandSmartContractAddress()
      ).toString();
      setBrandAddress(tempBrandAddress);
    }
    if (brandIndex !== "0") {
      updateAddress();
    }
  }, [brandIndex]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      // console.log(`Account changed to ${account}`)
      // if (account == null) {
      //     window.localStorage.removeItem("connected")
      //     deactivateWeb3()
      //     console.log("Null Account found")
      // }
      updateUI();
    });
  }, []);

  return (
    //add new product btn
    <div className="warehouse">
      {/* {console.log(brandIndex)} */}
      {/* {console.log(brandAddress)} */}
      {/* {console.log(numOfTokens)} */}
      {/* {console.log(finalArr)} */}
      {/* {console.log(numOfTokens)} */}
      <h1>Welcome to Warehouse</h1>

      <section className="head">
        <div>
          <button
            onClick={() => (showForm ? setShowForm(false) : setShowForm(true))}
          >
            Add New Product
          </button>
        </div>
        <div>
          <label htmlfor="pack">Select a Warrenty Pack: </label>
          <select
            id="pack"
            name="pack"
            onChange={(e) => setWarrantyAdded(e.target.value)}
            value={warrantyAdded}
            required
          >
            <option value="1">30 Days</option>
            <option value="2">60 Days</option>
            <option value="3">90 Days</option>
          </select>
          <button
            onClick={async () => {
              await extendWarranty({
                onSuccess: () => console.log("success"),
                onError: (error) => console.log(error),
              });
            }}
          >
            Extend Warranty
          </button>
        </div>
        <div>
          <h3>Warranty Left : {brandWarrantyLeft}</h3>
        </div>
      </section>
      <section>
        {showForm ? (
          // <AddProduct brandIndex={brandIndex} />
          <AddProduct
            brandIndex={brandIndex}
            brandAddress={brandAddress}
            updateTokenCount={updateNumberOfTokens}
          />
        ) : (
          <h3>Your Products</h3>
        )}
        <div className="cards-outer">
          <section className="cards">
            {numOfTokens !== "0" &&
              finalArr.length !== 0 &&
              finalArr.map((one) => {
                return (
                  <Product
                    key={one.tokenId}
                    tokenId={one.tokenId}
                    brandIndex={brandIndex}
                    brandAddress={brandAddress}
                    name={one.name}
                    image={one.image}
                    serialNumber={one.serialNumber}
                    productLink={one.productLink}
                    description={one.description}
                    price={one.price}
                  />
                );
              })}
          </section>
        </div>
        {/* <section className="cards">
            <Product
              key={1}
              title={"title"}
              imgURL={
                "https://images.unsplash.com/photo-1499013819532-e4ff41b00669?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80"
              }
              text={"text"}
            />
            <Product
              key={2}
              title={"title"}
              imgURL={
                "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFnfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=600&q=60"
              }
              text={"text"}
            />
            <Product
              key={3}
              title={"title"}
              imgURL={
                "https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y3VzaGlvbnxlbnwwfDJ8MHx8&auto=format&fit=crop&w=600&q=60"
              }
              text={"text"}
            />
            <Product
              key={4}
              title={"title"}
              imgURL={
                "https://images.unsplash.com/photo-1635542529858-566ad6c4b4a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80"
              }
              text={"text"}
            />
            <Product
              key={5}
              title={"title"}
              imgURL={
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c3VuZ2xhc3N8ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
              }
              text={"text"}
            />
          </section>
          <div> */}
        {/* <h1>Cards</h1>
            {numOfTokens !== "0" &&
              finalArr.length !== 0 &&
              finalArr.map((one) => {
                // console.log(one);
                // console.log(one);
                return (
                  <Product
                    key={one.serialNumber}
                    title={one.name}
                    imgURL={one.image}
                    text={one.description}
                  />
                );
              })} */}
        {/* </div> */}
        {/* </div> */}
      </section>
    </div>
  );
}

export default Warehouse;
