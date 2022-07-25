import React from "react";
import Login from '../../forms/login';
import ViewTable from './viewTable';
import './admin.css';
import {useState, useEffect} from 'react';
import {useMoralis} from 'react-moralis';

function Admin() {
  const {isWeb3Enabled, account} = useMoralis();
  const [showComp, setShowComp]  =  useState(false);
  const authAcc="0x726fa710e16d31b0db81741fc1e97b70234a779a";
  useEffect(()=>{
    if(isWeb3Enabled)
          setShowComp(true)
  }, [isWeb3Enabled])
  return (
    <div className="landingAdmin">
      {
        showComp ? (
          (account==authAcc) ? <ViewTable /> : <h1>You are not authorised🚷 </h1>
        ) : (
          (<h1>Connect Wallet</h1>)
        )
      }
    </div>
  );
}

export default Admin;
