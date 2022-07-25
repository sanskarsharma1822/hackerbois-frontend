import React from "react";
//import {init} from "./utils/initDrone.js";
import {Link} from 'react-router-dom';
import './home.css'
import "../customer/customer.css"

function Home() {

  return (
<div className="homeContainer">
    <section className="home" >
      <h1>Choose profile here</h1>
      <button ><Link to="/admin">ADMIN</Link></button>
      <button><Link to="/brand">BRAND</Link></button>
      <button><Link to="/customer">CUSTOMER</Link></button>
    </section>
  </div>
  );
}

export default Home;

