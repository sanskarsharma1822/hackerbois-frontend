import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../customer/customer.css';
import axios from '../../api/axios.js';
import Warehouse from './warehouse.js';

const REGISTER_URL = '/register'; //fitting url

function RegisterBrand() {

    const userRef = useRef();
    const errRef = useRef();

    const [name, setName] = useState('');
    const [nameFocus, setNameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [emailFocus, setEmailFocus] = useState(false);

    const [id, setId] = useState('');
    const [idFocus, setIdFocus] = useState(false);

    const [warrenty, setWarrenty] = useState('');
    const [warrentyFocus, setWarrentyFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    //whenever the thing in the bracket(dependency array) changes this useEffect will be called again
    useEffect(() => {
        userRef.current.focus();
    }, [])

    //name should be a string
    /*useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name])

    //price should be a number
    useEffect(() => {
        setValidPrice(PRICE_REGEX.test(price));
    }, [price])*/

    //if any of the variables change
    useEffect(() => {
        setErrMsg('');
    }, [name, email, id, warrenty])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        //const v1 = NAME_REGEX.test(name);
        //const v2 = PRICE_REGEX.test(price);
        /*baki fields ka bhi validation karna hai?
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }*/
        try {
            setSuccess(true);
            /*const response = await axios.post(REGISTER_URL,
                JSON.stringify({ name: name, price: price, descp: descp, imgURL:imgURL, serialNo: serialNo, prodLink:prodLink, tokenId:tokenId}), //backend expects: state name here
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);*/
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setName('');
            setEmail('');
            setId('');
            setWarrenty('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <div classsName="registerContainer">
            {/*if registration of product was successful -> go to warehouse */}
            {success ? (
                //<Link to='/dh'></Link>
                <h1>registered</h1>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register Brand</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">
                            Brand Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                            //aria-invalid={validName ? "false" : "true"}
                            //aria-describedby="uidnote"//wtf is this
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                        />
                        {/*<p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
            </p>*/}
                        <label htmlFor="email">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            ref={userRef}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            //aria-invalid={validPrice ? "false" : "true"}
                            //aria-describedby="pricenote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        {/*<p id="pricenote" className={priceFocus && !validPrice ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Price should be a Number 
        </p>*/}
                        <label htmlFor="id">
                            Brand ID:
                        </label>
                        <input
                            type="text"
                            id="id"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setId(e.target.value)}
                            value={id}
                            required
                            //aria-invalid={validName ? "false" : "true"}
                            //aria-describedby="uidnote"
                            onFocus={() => setIdFocus(true)}
                            onBlur={() => setIdFocus(false)}
                        />
                        <label htmlfor="pack">Select a Warrenty Pack:</label>
                        <select
                            id="pack"
                            name="pack"
                            onChange={(e) => setWarrenty(e.target.value)}
                            value={warrenty}
                            required>
                            <option value="30 days">30 Days</option>
                            <option value="60 days">60 Days</option>
                            <option value="90 days">90 Days</option>
                        </select>
                        <button disabled={!name || !email || !id || !warrenty ? true : false} >Register</button>
                    </form>
                </section>
            )}</div>
    )
}


export default RegisterBrand;