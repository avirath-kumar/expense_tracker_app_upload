import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

import { NavButtons } from "./NavButtons.js";

export function CategorizationPage () {
    // Make GET request to API server.js 
    const [backendData, setBackendData] = useState([{}]);
    useEffect (() => {
        fetch("http://localhost:8081/categorization").then(
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
            <Heading />
            <DataTable categoryData={backendData}/>
            <BarChart categoryData={backendData} />
        </div>
    );
}

function Heading () {
    const pageTitle = "Expense Tracker - Categorization"; 
    const billingCycle = "01/10/23 - 02/06/23"; // this needs to be made dynamic
    return (
      <div>
        <h1>{pageTitle}</h1>
        <h3>{billingCycle}</h3>
      </div>
    )
}

function DataTable (props) {
    // Set table headers
    const headers = ["Category", "Total Spend", "Percent of Total"];
    
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
            {props.categoryData.map((category, i) => (
            <tr key={i}>
                {/* NEED TO ADD KEYS but works for now */}
                <td>{category.category}</td>
                <td>${category.totalSpend}</td>
                <td>{category.percent}%</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    )
}

function BarChart (props) {
      return (
        <div>
            <h3>Spending by Category as % of Total Spend</h3>
            <h5>01/10/23 - 02/06/23</h5>
            <Bar 
                data={{
                    labels: props.categoryData.map((data) => (
                        data.category
                    )),
                    datasets: [{
                        label: '% of Total Spend',
                        data: props.categoryData.map((data) => (
                            data.percent
                        )),
                        borderWidth: 2,
                    }],
                }}
                height={100}
                width={200}
                options={{
                    maintainAspectRatio: true,
                    layout: {
                        padding: 45,
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Spend Category'
                            },
                            ticks: {
                               display: false
                          }
                       }
                    }
                }}
            />
        </div>
      )
}