import React, { useEffect, useState } from "react";
//import {init} from "./utils/initDrone.js";
import { Link } from "react-router-dom";
import "../../App.css";
import "./home.css";
import "../customer/customer.css";
// import Spinner from "../Spinner/spinner";

function Home() {
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2500);
  // }, []);

  // return loading ? (
  //   <Spinner />
  // ) : (
  return (
    <div className="fullbox">
      <div className="homeContainer">
        <section className="home">
          <h1>Choose profile here</h1>

          <button>
            <Link to="/admin">ADMIN</Link>
          </button>

          <button>
            <Link to="/brand">BRAND</Link>
          </button>
          <button>
            <Link to="/customer">CUSTOMER</Link>
          </button>
        </section>
      </div>
    </div>
  );
}

export default Home;
