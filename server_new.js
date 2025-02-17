const express = require('express');
const fs = require('fs');
const { parse } = require('csv-parse');
const sqlite3 = require('sqlite3').verbose();
const prompt = require('prompt-sync')();
const cors = require('cors');

const app = express();
const PORT = 8081;

// Global variables that get sent to front end
let queryResults = [];
let categories = [];
let userFileName = "";
let dbFiles = [];

// Express code below

app.use(cors());

// Spin up Express server on port 8081
app.listen(PORT, (error) => {
    if(!error) {
        console.log("Server is succesfully running and App is listening on Port " + PORT);
    }
    else {
        console.log("Error occurred, server can't start", error);
    }
});

// Function #1: render and serve up list of files in directory
function filesInFolder () {
    return new Promise(function(resolve, reject) {
        const dbFolder = './db/';
        fs.readdir(dbFolder, (err, files) => {
            files.forEach(file => {
                dbFiles.push(file.slice(0, -3));
            resolve();
            });
        });
    });
};

// Endpoint #1 - send category data to front end
function fileData () {
    app.get('/files', (req, res) => {
        res.status(200);
        res.send(dbFiles);
    });
};

// Endpoint #2: listen for post request from billingcycle react component
function billingCycle () {
    app.post('/files', (req, res) => {
        console.log(req.body);
    });
};

// Run Function: calls all main functions using async/await
async function runFunctions () {
    // code pauses execution and waits for each function to return a promise. When resolve is returned, execution continues to next line
    await filesInFolder();
    // Functions that send data to front end:
    fileData();
    billingCycle();
};

runFunctions();
