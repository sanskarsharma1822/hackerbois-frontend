import React, { useState, useEffect } from "react";
import axios from "axios";
import * as ReactBootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./admin.css";
import "../../App.css";
import console from "console-browserify";
import { Spinner } from "react-bootstrap";

//-------------------------------------------------------

import { useMoralis, useWeb3Contract } from "react-moralis";
import {
  adminABI,
  adminContractAddress,
} from "../../constants/Admin/adminConstants";

import {
  brandFactoryABI,
  brandFactoryContractAddress,
} from "../../constants/BrandFactory/brandFactoryConstants";

import { useNotification } from "web3uikit";

//----------------------------------------------------------

function ViewTable() {
  // const [entries, setEntries] = useState({ blogs: [] });
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const dispatch = useNotification();
  const chainId = parseInt(chainIdHex);
  const adminAddress =
    chainId in adminContractAddress ? adminContractAddress[chainId][0] : null;
  const brandFactoryAddress =
    chainId in brandFactoryContractAddress
      ? brandFactoryContractAddress[chainId][0]
      : null;
  const [adminAccount, setAdminAccount] = useState(0);
  const [brandsArr, setBrandsArr] = useState([]);
  const [brandsBalance, setBrandsBalance] = useState("0");

  const { runContractFunction: getBrandArrays } = useWeb3Contract({
    abi: adminABI,
    contractAddress: adminAddress,
    functionName: "getBrandArrays",
    params: {},
  });

  const {
    runContractFunction: withdraw,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: brandFactoryABI,
    contractAddress: brandFactoryAddress,
    functionName: "withdraw",
    params: {},
  });

  const { runContractFunction: getBalace } = useWeb3Contract({
    abi: brandFactoryABI,
    contractAddress: brandFactoryAddress,
    functionName: "getBalace",
    params: {},
  });

  const updateUI = async function () {
    const tempArray = await getBrandArrays();
    const tempBalance = (await getBalace()).toString();
    setBrandsBalance(tempBalance);
    setBrandsArr(tempArray);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
      // setShowComp(true);
    }
  }, [isWeb3Enabled]);

  // useEffect(() => {
  //   const fetchEntryList = async () => {
  //     const { data } = await axios(
  //       "https://jsonplaceholder.typicode.com/posts"
  //     );
  //     //   const data = {
  //     //     id: 1,
  //     //     title: "Sample",
  //     //     body: "hello world my name is Sanskar Sharma",
  //     //   };
  //     setEntries({ blogs: data });
  //     //   console.log(data);
  //   };
  //   fetchEntryList();
  // }, [setEntries]);
  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNotification(tx);
    updateUI();
  };

  const handleNotification = function (tx) {
    dispatch({
      type: "success",
      message: "Transaction Complete",
      title: "Funds Transfered",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div className="fullbox">
      <div className="table-container">
        <ReactBootstrap.Table>
          <thead>
            <tr>
              <th>BRAND ID</th>
              <th>BRAND ADDRESS</th>
              <th>BRAND NAME</th>
              <th>BRAND EMAIL</th>
              <th>WARRANTY LEFT</th>
            </tr>
          </thead>
          <tbody>
            {brandsArr.length &&
              brandsArr.map((currBrand) => (
                <tr key={currBrand.brandID.toString()}>
                  <td>{currBrand.brandID.toString()}</td>
                  <td>{currBrand.brandAddress.toString()}</td>
                  <td>{currBrand.brandName.toString()}</td>
                  <td>{currBrand.brandEmailAddress.toString()}</td>
                  <td>{currBrand.warrantyPeriod.toString()}</td>
                  {/* <td>{currBrand.smartContractAddress.toString()}</td> */}
                </tr>
              ))}
          </tbody>
        </ReactBootstrap.Table>

        <button
          style={{ width: "15%", padding: "12px 32px 12px 25px" }}
          onClick={async () => {
            await withdraw({
              onSuccess: handleSuccess,
              onError: (error) => console.log(error),
            });
          }}
        >
          {isLoading || isFetching ? (
            <Spinner animation="grow" variant="dark" size="sm" />
          ) : (
            "Withdraw"
          )}
        </button>
      </div>
    </div>
  );
}

export default ViewTable;
