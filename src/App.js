import React, { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import DummyCanvas from "../src/pages/dummy3/dummyCanvas.js";
import Admin from "./pages/admin/landing";
import Brand from "./pages/brand/landing";
import Customer from "./pages/customer/landing";
import ConnectWallet from "../src/pages/brand/connectWallet";
import Warehouse from "./pages/brand/warehouse";
import Error from "./pages/error";
import { MoralisProvider } from "react-moralis";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Loading from "./Loading";

//Shanky Imports
import { NotificationProvider } from "web3uikit";

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4500);
  }, []);
  //4500
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <div className="App">
          {loading ? (
            <Loading />
          ) : (
            <Router>
              <nav style={{ fontFamily: "cursive" }}>
                <Link className="navheaders" to="/">
                  Home
                </Link>
                <Link className="navheaders" to="/admin">
                  Admin
                </Link>
                <Link className="navheaders" to="/brand">
                  Brand
                </Link>
                <Link className="navheaders" to="/customer">
                  Customer
                </Link>
                <ConnectWallet />
              </nav>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/brand" element={<Brand />} />
                <Route path="/brand/warehouse" element={<Warehouse />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="*" element={<Error />} />
              </Routes>
              {
                //<div className="Footer">Footer</div>
              }
            </Router>
          )}
        </div>
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default App;
