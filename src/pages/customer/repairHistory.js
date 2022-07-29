import React, { useState, useEffect } from "react";
import axios from "axios";
import * as ReactBootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import console from "console-browserify";

import { useMoralis, useWeb3Contract } from "react-moralis";
import { brandsABI } from "../../constants/Brands/brandsConstant";
import storeRepairHistory from "../../backendScripts/storeRepairHistory";

function Repair({ brandIndex, brandAddress, tokenId }) {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();

  const [tokenURI, setTokenURI] = useState("");
  const [history, setHistory] = useState([]);

  const { runContractFunction: viewhistory } = useWeb3Contract({
    abi: brandsABI,
    contractAddress: brandAddress,
    functionName: "viewhistory",
    params: {
      _tokenId: tokenId,
    },
  });

  useEffect(() => {
    async function updateTokenURI() {
      const tempURI = await viewhistory({
        onError: (error) => console.log(error),
      });
      setTokenURI(tempURI);
    }

    if (isWeb3Enabled) {
      updateTokenURI();
    }
  }, []);

  const updateHistory = async () => {
    const { data } = await axios.get(`${tokenURI}`);
    const { repairHistory } = data;
    setHistory(repairHistory);
  };

  useEffect(() => {
    if (tokenURI !== "") {
      updateHistory();
    }
  }, [tokenURI]);
  //console.log("ho!")
  // const [entries, setEntries] = useState({ blogs: [] });

  // useEffect(() => {
  //   const fetchEntryList = async () => {
  //     const { data } = await axios(
  //       "https://jsonplaceholder.typicode.com/posts"
  //     );
  //     setEntries({ blogs: data });
  //     // console.log(data);
  //   };
  //   fetchEntryList();
  // }, [setEntries]);

  return (
    <div>
      <ReactBootstrap.Table striped bordered hover>
        <thead>
          <tr>
            <th>PRODUCT ID</th>
            {/* <th>BRAND ID</th> */}
            {/* <th>WARRENTY </th> */}
            <th>PROBLEM DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          {history.length &&
            history.map((item) => (
              <tr>
                <td>{item.date}</td>
                <td></td>
              </tr>
            ))}
        </tbody>
      </ReactBootstrap.Table>
    </div>
  );
}

export default Repair;
