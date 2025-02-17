import React, { useEffect, useState } from 'react';

import { NavButtons } from "./NavButtons.js";

export function BillingCyclePage () {
    // Make GET request to API server for billing cycles db files on disk
    const [backendData, setBackendData] = useState([{}]);
    useEffect (() => {
    fetch("http://localhost:8081/files").then(
        response => response.json()
    ).then(
        data => {
        setBackendData(data);
        }
    );
    }, []);
    
    return (
        <div>
            <div><NavButtons /></div>
            <h1>Expense Tracker - Billing Cycle</h1>
            <h2>Welcome, User</h2>
            <FilesList listOfFiles = {backendData} />
        </div>
    );
};

function FilesList (props) {
    
    // Make POST request to API server to send selected billing cycle to back end
    const [postData, setPostData] = useState([{}]);
    const handleSubmit = async(event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8081/files", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ postData: postData})}
                );

            // print the post request response to the console
            const data = await response.json();
            console.log(data);

            // Reset the form data
            setPostData({});
        }

        catch(error) {
            console.error(error);
        };
    };
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Select a billing cycle:
                    <select value={postData} onChange={(event) => setPostData({postData: event.target.value})}>
                        {props.listOfFiles.map((billingCycle, i) => (
                            <option value={String(billingCycle)} key={i}>{String(billingCycle)}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};