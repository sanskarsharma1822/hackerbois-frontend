import React, { useState, useEffect } from "react";
import "./spinner.css";

//card which displays the product
function Spinner({ show }) {
  return (
    <img
      src="Flipkart.svg"
      style={{
        height: "500px",
        width: "500px",
        position: "absolute",
        top: "150px",
        left: "510px",
      }}
      id="spin"
    ></img>
  );
}

export default Spinner;
