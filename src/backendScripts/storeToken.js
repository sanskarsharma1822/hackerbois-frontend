import Moralis from "moralis";
import console from "console-browserify";
import { useMoralis } from "react-moralis";
// import dotenv from "dotenv";
// dotenv.config();

async function storeData(
  name,
  imageData,
  serialNumber,
  productLink,
  description,
  price,
  chainId
) {
  // MORALIS VARIABLES TO BE STORED IN ENV

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const appId = process.env.REACT_APP_APP_ID;
  const masterKey = process.env.REACT_APP_MASTER_KEY;

  Moralis.start({ serverUrl, appId, masterKey });

  // const web3 = await Moralis.enableWeb3();
  // const chainIdDec = await web3.eth.getChainId();
  await Moralis.enableWeb3({ chainId: chainId });
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
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const appId = process.env.REACT_APP_APP_ID;
  const masterKey = process.env.REACT_APP_MASTER_KEY;

  Moralis.start({ serverUrl, appId, masterKey });

  await Moralis.enableWeb3({ chainId: 31337 });

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
