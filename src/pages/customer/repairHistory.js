import React, { useState, useEffect } from "react";
import axios from "axios";
import * as ReactBootstrap from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Repair() {
  //console.log("ho!")
  const [entries, setEntries] = useState({ blogs: [] });

  useEffect(() => {
    const fetchEntryList = async () => {
      const { data } = await axios(
        "https://jsonplaceholder.typicode.com/posts"
      );
      setEntries({ blogs: data });
      // console.log(data);
    };
    fetchEntryList();
  }, [setEntries]);

  return (
    <div>
      <ReactBootstrap.Table striped bordered hover>
        <thead>
          <tr>
            <th>PRODUCT ID</th>
            <th>BRAND ID</th>
            <th>WARRENTY </th>
            <th>PROBLEM DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          {entries.blogs &&
            entries.blogs.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.userId}</td>
                <td>{item.body}</td>
              </tr>
            ))}
        </tbody>
      </ReactBootstrap.Table>
    </div>
  );
}

export default Repair;
