import Moralis from "moralis";
import console from "console-browserify";
// import dotenv from "dotenv";
// dotenv.config();

// async function login() {
//   Moralis.Web3.authenticate().then(function (user) {
//     console.log("logged in");
//   });
// }

async function storeData(
  name,
  imageData,
  serialNumber,
  productLink,
  description,
  price
) {
  console.log("You are here");
  // MORALIS VARIABLES TO BE STORED IN ENV

  // const serverUrl = process.env.SERVER_URL;
  // const appId = process.env.APP_ID;
  // const masterKey = process.env.MASTER_KEY;

  Moralis.start({ serverUrl, appId, masterKey });

  // const web3 = await Moralis.enableWeb3();
  // const chainIdDec = await web3.eth.getChainId();
  await Moralis.enableWeb3({ chainId: 31337 });
  // await Moralis.enableWeb3({ chainId: 31337 });

  const image = await uploadImage(imageData);
  const result = [];
  const tokenURI = await uploadMetaData(
    name,
    image,
    serialNumber,
    productLink,
    description,
    price
  );

  result.push(tokenURI);

  const historyURI = await storeHistory(image);
  result.push(historyURI);

  return result;
}

async function uploadMetaData(
  name,
  image,
  serialNumber,
  productLink,
  description,
  price
) {
  // const image = uploadImage(imageData);

  const tokenURI = {
    name: name,
    image: image,
    serialNumber: serialNumber,
    productLink: productLink,
    description: description,
    price: price,
  };
  const file = new Moralis.File("file.json", {
    base64: btoa(JSON.stringify(tokenURI)),
  });
  await file.saveIPFS({ useMasterKey: true });
  console.log(file.ipfs());
  return file.ipfs();
}

async function storeHistory(image) {
  const metaData = {
    name: "History",
    image: image,
    description:
      "This JSON Data shows the Repair History and Owner History for NFT",
    repairHistory: [],
    ownerHistory: [],
  };
  const file = new Moralis.File("file.json", {
    base64: btoa(JSON.stringify(metaData)),
  });
  await file.saveIPFS();

  console.log("History : ", file.ipfs());
  return file.ipfs();
}

async function uploadImage(fileInput) {
  // const serverUrl = "https://6zdkjezjlhyg.usemoralis.com:2053/server";
  // const appId = "Y0jqmKUvI8GEPpBzlWwcKIiTVk89Wt1FuleTEHZE";
  // const masterKey = "X2rHNLeuDD658Dn1xOWqPa8hp86EK6JKyYnMsmbC";

  // // const serverUrl = process.env.SERVER_URL;
  // // const appId = process.env.APP_ID;
  // // const masterKey = process.env.MASTER_KEY;

  // Moralis.start({ serverUrl, appId, masterKey });

  // const web3 = await Moralis.enableWeb3();
  // const chainIdDec = await web3.eth.getChainId();
  // await Moralis.enableWeb3({ chainId: 31337 });

  // console.log(fileInput[0]);
  const data = fileInput[0];
  console.log(data);
  const file = new Moralis.File(data.name, data);
  console.log(file);
  await file.saveIPFS({ useMasterKey: true });
  return file.ipfs();
}

export default storeData;
