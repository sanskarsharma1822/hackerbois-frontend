import React, { useState, useEffect } from 'react';
import Product from './eachProduct.js';
import './brand.css';
import axios from 'axios';
import AddProduct from './addProduct.js'

function Warehouse() {
    const [products, setProducts] = useState({ items: [] });
    const [showForm, setShowForm] = useState(false)
    /*useEffect(() => {
        const fetchProductsList = async () => {
            const { data } = await axios("https://jsonplaceholder.typicode.com/photos");
            setProducts({ items: data });
            console.log(data);
        }
        fetchProductsList();
    }, [setProducts])*/

    return (//add new product btn
        <div className="warehouse">
            <section className="head">
                <h1>Welcome to Warehouse</h1>
                <div>
                <button onClick={() => showForm ? setShowForm(false) : setShowForm(true)}>Add New Product</button>
                </div>
            </section>
            <section>
                {
                    showForm ? (
                        <AddProduct />
                    ) : (
                        <h3>Your Products</h3>
                    )
                }
                <div className="cards-outer">
                <section className="cards">
                    <Product key={1} title={"title"} imgURL={"https://images.unsplash.com/photo-1499013819532-e4ff41b00669?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80"} text={"text"} />
                    <Product key={2} title={"title"} imgURL={"https://images.unsplash.com/photo-1546938576-6e6a64f317cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFnfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=600&q=60"} text={"text"} />
                    <Product key={3} title={"title"} imgURL={"https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y3VzaGlvbnxlbnwwfDJ8MHx8&auto=format&fit=crop&w=600&q=60"} text={"text"} />
                    <Product key={4} title={"title"} imgURL={"https://images.unsplash.com/photo-1635542529858-566ad6c4b4a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80"} text={"text"} />
                    <Product key={5} title={"title"} imgURL={"https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c3VuZ2xhc3N8ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"} text={"text"} />
                </section>
                </div>
            </section>
        </div>
    )
}

export default Warehouse;