import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Repair from "./repairHistory";
import ClaimWarrenty from "./claimWarrenty.js";
import Transfer from "./transferWarrenty.js";
import "./customer.css";
import console from "console-browserify";
import { brandsABI } from "../../constants/Brands/brandsConstant";
import { useMoralis, useWeb3Contract } from "react-moralis";

//card which displays the product
function ViewProduct({
  title,
  text,
  imgURL,
  brandIndex,
  brandId,
  brandAddress,
  tokenId,
}) {
  const [active, setActive] = useState("");
  const [val, setVal] = useState("");
  const { isWeb3Enabled } = useMoralis();

  const { runContractFunction: validityPeriod } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "validityPeriod",
    params: { _tokenId: tokenId },
  });

  const updateIsOwner = async function () {
    const tempValidityPeriod = await validityPeriod({
      onError: (error) => console.log(error),
    });
    setVal(tempValidityPeriod);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateIsOwner();
    }
  }, []);
  return (
    <div className="viewProd">
      <h1>Product Information</h1>
      <Card style={{ width: "18rem", height: "50vh" }}>
        <Card.Img
          variant="top"
          src={imgURL}
          style={{ objectFit: "cover", height: "20vh" }}
        />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{text}</Card.Text>
        </Card.Body>
      </Card>
      <div className="btns">
        <button onClick={() => setActive("claim")}>Claim Warranty</button>
        <button onClick={() => setActive("repair")}>Repair History</button>
        <button onClick={() => setActive("transfer")}>
          Transfer Ownership
        </button>
      </div>
      {active === "claim" && (
        <ClaimWarrenty
          brandIndex={brandIndex}
          brandAddress={brandAddress}
          tokenId={tokenId}
        />
      )}
      {active === "repair" && (
        <Repair
          brandIndex={brandIndex}
          brandAddress={brandAddress}
          tokenId={tokenId}
        />
      )}
      {active === "transfer" && (
        <Transfer
          brandIndex={brandIndex}
          brandId={brandId}
          brandAddress={brandAddress}
          tokenId={tokenId}
          name={title}
          val={val}
        />
      )}
    </div>
  );
}

export default ViewProduct;
