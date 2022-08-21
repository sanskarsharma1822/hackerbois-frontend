import React from "react";
import Login from "../../forms/login";
import ViewTable from "./viewTable";
import "./admin.css";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import Notauthorized from "./notauthorized";

//-------------------------------------------------------------
import {
  adminABI,
  adminContractAddress,
} from "../../constants/Admin/adminConstants";
//-------------------------------------------------------------

function Admin() {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const [showComp, setShowComp] = useState(false);

  //-------------------------------------------------------------
  const chainId = parseInt(chainIdHex);
  const adminAddress =
    chainId in adminContractAddress ? adminContractAddress[chainId][0] : null;
  const [adminAccount, setAdminAccount] = useState(0);

  const { runContractFunction: getOwner } = useWeb3Contract({
    abi: adminABI,
    contractAddress: adminAddress,
    functionName: "getOwner",
    params: {},
  });

  const updateUI = async function () {
    const tempOwner = (await getOwner()).toString().toLowerCase();
    setAdminAccount(tempOwner);
    setShowComp(true);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
      // setShowComp(true);
    }
  }, [isWeb3Enabled]);
  //-------------------------------------------------------------

  return (
    <div className="landingAdmin">
      {showComp ? (
        account == adminAccount ? (
          <ViewTable />
        ) : (
          <Notauthorized />
        )
      ) : (
        <h1>Connect Wallet</h1>
      )}
    </div>
  );
}

export default Admin;
