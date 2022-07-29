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
  brandAddress,
  tokenId,
}) {
  const [active, setActive] = useState("");

  return (
    <div className="viewProd">
      <h1>Product Information</h1>
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={imgURL} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{text}</Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
      <div className="btns">
        <button onClick={() => setActive("claim")}>Claim Warrenty</button>
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
          brandAddress={brandAddress}
          tokenId={tokenId}
        />
      )}
    </div>
  );
}

export default ViewProduct;
