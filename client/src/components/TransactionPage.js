import React, { useEffect, useState } from 'react';
import { NavButtons } from "./NavButtons.js";

export function TransactionPage () {
  // Make GET request to API server.js 
  const [backendData, setBackendData] = useState([{}]);
  useEffect (() => {
    fetch("http://localhost:8081/transactions").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data);
      }
    );
  }, []);  
  
  return (
      <div>
        <Heading />
        <DataTable transactionData={backendData}/>
      </div>
    );
  }

  function Heading () {
    const pageTitle = "Expense Tracker - Transactions"; 
    const billingCycle = "01/10/23 - 02/06/23"; // this needs to be made dynamic
    return (
      <div>
        <div><NavButtons /></div>
        <h1>{pageTitle}</h1>
        <h3>{billingCycle}</h3>
      </div>
    )
  }

  function DataTable (props) {
    // Set table headers
    const headers = ["Date", "Description", "Amount", "Category"];
    
    // Render the data table
    return (
      <div>
        <table>
          <tbody>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
            {props.transactionData.map((transaction, i) => (
              <tr key={i}>
                {/* NEED TO ADD KEYS but works for now */}
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>${transaction.amount}</td>
                <td>{transaction.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }