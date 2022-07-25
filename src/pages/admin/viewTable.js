import React, { useState, useEffect } from 'react'
import axios from 'axios';
import * as ReactBootstrap from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';


function ViewTable() {

    const [entries, setEntries] = useState({ blogs: [] })

    useEffect(() => {
        const fetchEntryList = async () => {
            const { data } = await axios("https://jsonplaceholder.typicode.com/posts");
            setEntries({ blogs: data });
            console.log(data);
        }
        fetchEntryList();
    }, [setEntries])

    return (
        <div className="table-container">
            <ReactBootstrap.Table >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>BRAND NAME</th>
                        <th>DESCRIPTION</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        entries.blogs && entries.blogs.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.title}</td>
                                <td>{item.body}</td>
                            </tr>
                        ))

                    }
                </tbody>
            </ReactBootstrap.Table>
        </div>
    )
}

export default ViewTable