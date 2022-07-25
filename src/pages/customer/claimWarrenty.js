
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import './customer.css';
import axios from '../../api/axios.js';

function ClaimWarrenty() {

  const userRef = useRef();
  const errRef = useRef();

  const [descp, setDescp] = useState('');
  const [descpFocus, setDescpFocus] = useState(false);
  const response =true;

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if(response==false){
            alert("Problem sending your request  :(");
        }
        else if(response==true){
            alert("Query has been sent :)");
            setSuccess(true);
        }
      setDescp('');
    } catch (err) {
      /*if any error in actual res*/
      errRef.current.focus();
    }
  }

  return (
    <div classsName="registerContainer">

      {success ? (
        <h1>We'll let you know if the query was processed</h1>
      ) : (
        <section>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <h1>Claim Warrenty</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="descp">
              Describe your issue:
            </label>
            <input
              type="text"
              id="descp"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setDescp(e.target.value)}
              value={descp}
              required
              //aria-invalid={validName ? "false" : "true"}
              //aria-describedby="uidnote"
              onFocus={() => setDescpFocus(true)}
              onBlur={() => setDescpFocus(false)}
            />
            <button disabled={!descp ? true : false} >Send Request</button>
          </form>
          <p>
            Already registered?<br />
            <span className="line">
              {/*put router link here*/}
              <a href="#">Sign In</a>
            </span>
          </p>
        </section>
      )}</div>
  );
}

export default ClaimWarrenty;

