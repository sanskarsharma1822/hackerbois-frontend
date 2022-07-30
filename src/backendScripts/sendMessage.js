// const Vonage = require("@vonage/server-sdk");
import Vonage from "@vonage/server-sdk";
import console from "console-browserify";

const sendMessage = (phoneNum, tokenId, brandId) => {
  const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
  });

  const from = "919868910520";
  const to = `91${phoneNum}`;
  const text = `Product Warranty Recieved. Brand Id : ${brandId}  Product Id : ${tokenId} . Use these to claim warranty and avail all other benefits.`;

  vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
};

export default sendMessage;
