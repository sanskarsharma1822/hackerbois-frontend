
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import '../../forms/register.css';
import axios from '../../api/axios.js';

function Transfer() {

  const userRef = useRef();
  const errRef = useRef();

  const [newAdd, setNewAdd] = useState('');
  const [newAddFocus, setNewAddFocus] = useState(false);

  const [contact, setContact] = useState('');
  const [ContactFocus, setContactFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const response=false; //dummy variable

  useEffect(() => {
    userRef.current.focus();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if(response==false){
            alert("Transfer was not a  :(");
        }
        else if(response==true){
            alert("Transfer was a Success :)");
            setSuccess(true);
        }
      setNewAdd('');
      setContact('');
    } catch (err) {
      /*if any error in actual res*/
      errRef.current.focus();
    }
  }

  return (
    <div classsName="registerContainer">

      {success ? (
        <h1>transferred</h1>
      ) : (
        <section>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <h1>New Owner</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="add">
              New Owner Address:
            </label>
            <input
              type="text"
              id="add"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setNewAdd(e.target.value)}
              value={newAdd}
              required
              //aria-invalid={validName ? "false" : "true"}
              //aria-describedby="uidnote"
              onFocus={() => setNewAddFocus(true)}
              onBlur={() => setNewAddFocus(false)}
            />
            <label htmlFor="contact">
              Contact No.:
            </label>
            <input
              type="number"
              id="contact"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              required
              //aria-invalid={validName ? "false" : "true"}
              //aria-describedby="uidnote"
              onFocus={() => setContactFocus(true)}
              onBlur={() => setContactFocus(false)}
            />
            <button disabled={!contact || !newAdd ? true : false} >Transfer</button>
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

export default Transfer;
