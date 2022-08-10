import React, { useEffect, useState } from "react";
import console from "console-browserify";
import "./admin.css";

import { NotificationProvider } from "web3uikit";

function Notauthorized() {
  const restrictImgPaths = [
    "restrict1.png",
    "restrict2.png",
    "restrict3.png",
    "restrict4.png",
    "restrict5.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex === restrictImgPaths.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  return (
    <div
    //   style={{
    //     backgroundColor: "black",
    //     height: "100vh",
    //     width: "100vw",
    //     position: "absolute",
    //     top: "0",
    //     zIndex: "1",
    //   }}
    >
      <div></div>
      <div class="container">
        <div class="mockup mockup-macbook loaded opened">
          <div class="part top">
            <img src="macbook-top.png" alt="" class="top" />
            <img src={restrictImgPaths[currentIndex]} alt="" class="cover" />
          </div>
          <div class="part bottom">
            <img
              src="https://d1xm195wioio0k.cloudfront.net/images/mockup/macbook-cover.svg"
              alt=""
              class="cover"
            />
            <img src="macbook-bottom.png" alt="" class="bottom" />
          </div>
        </div>
      </div>
      {/* <div
        style={{ width: "100vw", height: "4rem", backgroundColor: "#851400" }}
      ></div> */}
    </div>
  );
}

export default Notauthorized;
