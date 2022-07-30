import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Repair from "./repairHistory";
import ClaimWarrenty from "./claimWarrenty.js";
import Transfer from "./transferWarrenty.js";
import "./customer.css";
import console from "console-browserify";
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
        />
      )}
    </div>
  );
}

export default ViewProduct;
