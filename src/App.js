import React from "react";
import './App.css';
import Home from "./pages/Home/Home";
import DummyCanvas from '../src/pages/dummy3/dummyCanvas.js'
import Admin from "./pages/admin/landing";
import Brand from "./pages/brand/landing";
import Customer from "./pages/customer/landing";
import ConnectWallet from '../src/pages/brand/connectWallet'
import Warehouse from './pages/brand/warehouse'
import Error from "./pages/error";
import { MoralisProvider } from "react-moralis";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <MoralisProvider>
      <div className="App">
        <Router>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/brand">Brand</Link>
            <Link to="/customer">Customer</Link>
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
      </div>
    </MoralisProvider>
  );
}

export default App;
