const express = require('express');
const fs = require('fs');
const { parse } = require('csv-parse');
const csvFilePath = "/Users/avikumar/Desktop/VS Code/expense_tracker_app/transactions/";
const db = require("./db");

const app = express();
const PORT = 3000;

let queryResults = [];

// Express code below
// Spin up server listening on PORT
app.listen(PORT, (error) => {
    if(!error) {
        console.log("Server is succesfully running and App is listening on Port " + PORT);
    }
    else {
        console.log("Error occurred, server can't start", error);
    }
});

// Set pug as the default view
app.set('view engine', 'pug');
app.set('views');

// Function #1: Read in and store CSV transaction data in DB
function readData () {
    return new Promise(function(resolve, reject) {
        const readStream = fs.createReadStream(csvFilePath + '02.07.23-03.09.23.csv').pipe(parse({ delimiter: ",", from_line: 2})); // EDIT FILENAME HERE
        readStream.on("data", function(row) {
            // code works up to here, missing rows upon insertion
            db.run(`INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10]]);      
        resolve();
        });
    });
};

// Function #2: Query DB for relevant data and store in memory
function pullData () {
    return new Promise(function(resolve, reject) {
        db.all('SELECT date, description, amount, category FROM transactions ORDER BY date DESC', function(err, rows) {
            rows.forEach(function (row) {
                queryResults.push(row);
            resolve();
            });
        });
    });
};

// Function #3: Send index.html file to front end
function sendData () {
    app.get('/', (req, res) => {
        res.status(200);
        res.render('index', {queryResults: queryResults});
    });
};

// Run Function: calls 3 main functions using async/await
async function runFunctions () {
    // code pauses execution and waits for redData to return a promise. When resolve is returned, execution continues to next line
    await readData();
    // code pauses execution and waits for pullData to return a promise. When resolve is returned, execution continues to next line
    await pullData();
    sendData();
};

runFunctions();