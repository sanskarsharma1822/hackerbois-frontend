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

  const adminAddress =
    chainId in adminContractAddress ? adminContractAddress[chainId][0] : null;

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

  const updateUI = async function () {
    const tempBrandAddress = (await getBrandSmartContractAddress()).toString();
    const tempBrandWarrantyLeft = (await getBrandWarrantyLeft()).toString();
    setBrandWarrantyLeft(tempBrandWarrantyLeft);
    setBrandAddress(tempBrandAddress);
    // console.log(tempAdd);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    async function updateFee() {
      console.log(warrantyAdded);
      const tempMul = (await getEntryFee()).toString();
      const tempFee = tempMul * 0.01;
      const tempFeeString = tempFee.toString();
      const final = ethers.utils.parseEther(tempFeeString);
      console.log(final.toString());
      setEntryFee(final.toString());
    }
    updateFee();
  }, [warrantyAdded]);

  // Moralis.onAccountChanged(updateUI());

  return (
    //add new product btn
    <div className="warehouse">
      {console.log(brandIndex)}
      {console.log(brandAddress)}

      <section className="head">
        <h1>Welcome to Warehouse</h1>
        <div>
          <button
            onClick={() => (showForm ? setShowForm(false) : setShowForm(true))}
          >
            Add New Product
          </button>
        </div>
        <label htmlfor="pack">Select a Warrenty Pack:</label>
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
        <div>
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
        <div>{brandWarrantyLeft}</div>
      </section>
      <section>
        {showForm ? <AddProduct /> : <h3>Your Products</h3>}
        <div className="cards-outer">
          <section className="cards">
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
        </div>
      </section>
    </div>
  );
}

export default Warehouse;
