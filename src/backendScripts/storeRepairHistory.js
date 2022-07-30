import fetch from "node-fetch";
import Moralis from "moralis";
import console from "console-browserify";
// require("dotenv").config();

async function storeRepairHistory(ipfs, newRepairHistory, chainId) {
  const ipfs_url = ipfs;
  const res = await fetch(ipfs_url);
  if (res.ok) {
    const oldRepairURI = await res.json();
    console.log(oldRepairURI);
    var name = oldRepairURI["name"];
    var description = oldRepairURI["description"];
    var repairHistory = oldRepairURI["repairHistory"];
    var image = oldRepairURI["image"];
    var ownerHistory = oldRepairURI["ownerHistory"];
  }

  const n = new Date();
  const date = n.toDateString();

  repairHistory.push({
    date: date,
    issue: newRepairHistory,
  });

  const result = await uploadMetaData(
    name,
    image,
    description,
    ownerHistory,
    repairHistory,
    chainId
  );
  return result;
}

async function uploadMetaData(
  name,
  image,
  description,
  ownerHistory,
  newRepairHistory,
  chainId
) {
  // MORALIS VARIABLES TO BE STORED IN ENV

  const serverUrl = process.env.SERVER_URL;
  const appId = process.env.APP_ID;
  const masterKey = process.env.MASTER_KEY;
  // const serverUrl = "https://6zdkjezjlhyg.usemoralis.com:2053/server";
  // const appId = "Y0jqmKUvI8GEPpBzlWwcKIiTVk89Wt1FuleTEHZE";
  // const masterKey = "X2rHNLeuDD658Dn1xOWqPa8hp86EK6JKyYnMsmbC";

  Moralis.start({ serverUrl, appId, masterKey });

  await Moralis.enableWeb3({ chainId: chainId });

  // const web3 = await Moralis.Web3.enable();
  // const chainIdDec = await web3.eth.getChainId();
  // await Moralis.enableWeb3({ chainId: chainIdDec });

  const metaData = {
    name: name,
    image: image,
    description: description,
    ownerHistory: ownerHistory,
    repairHistory: newRepairHistory,
  };
  const file = new Moralis.File("file.json", {
    base64: btoa(JSON.stringify(metaData)),
  });
  await file.saveIPFS({ useMasterKey: true });
  console.log(file.ipfs());
  // console.log(file.hash());
  return file.ipfs();
}

// async function main() {
//     await storeRepairHistory("https://ipfs.io/ipfs/QmQNm3U5tAPqgGEC77QhwKgt5ngTdKyEcPjxH1hQXe5Y61%22)
// }
// }

export default storeRepairHistory;
