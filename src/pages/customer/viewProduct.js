import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Repair from './repairHistory';
import ClaimWarrenty from './claimWarrenty.js'
import Transfer from './transferWarrenty.js';
import './customer.css'
//card which displays the product
function ViewProduct(props) {
    const [active, setActive] = useState('');

    return (
        <div className="viewProd">
            <h1>Product Information</h1>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={props.imgURL} />
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>
                        {props.text}
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
            <div className='btns'>
                <button onClick={() => setActive('claim')}>Claim Warrenty</button>
                <button onClick={() => setActive('repair')}>Repair History</button>
                <button onClick={() => setActive('transfer')}>Transfer Ownership</button>
            </div>
            {active === 'claim' && <ClaimWarrenty />}
            {active === 'repair' && <Repair />}
            {active === 'transfer' && <Transfer />}
        </div>
    )
}

export default ViewProduct;