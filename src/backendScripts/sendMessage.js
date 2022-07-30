import emailjs from "emailjs-com";
import console from "console-browserify";

const sendMail = (tokenId, name, brandId, val, userEmail) => {
  const params = {
    token_id: tokenId,
    product_name: name,
    brand_id: brandId,
    warranty: val.toString(),
    userEmail: userEmail,
  };

  emailjs
    .send("service_cik9ufa", "template_4qoa6fd", params, "ykmF7ZZAtQ8c5qLb2")
    .then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
  console.log(params);
};

export default sendMail;
