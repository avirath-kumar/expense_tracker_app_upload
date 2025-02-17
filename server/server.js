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
        // Read in data from CSV file after getting file name from user
        userFileName = prompt('Please enter the American Express billing cycle (format: XX.XX.XX-XX.XX.XX): ');
        const readStream = fs.createReadStream('./transactions/' + userFileName + '.csv').pipe(parse({ delimiter: ",", from_line: 2}));
        // If DB file already exists, execute this code
        if (fs.existsSync('./db/' + userFileName + '.db')) {
            console.log('Database already exists');    
            resolve();
            }
        // Else, create new DB and insert into DB
        else {
            const db = new sqlite3.Database('./db/' + userFileName + '.db', (error) => {
                if (error) {
                    return console.error(error.message);
                }
                db.exec(`
                CREATE TABLE transactions
                (
                    date TEXT,
                    description TEXT,
                    amount REAL,
                    extended_details TEXT,
                    appears_on_statement TEXT,
                    address TEXT,
                    city_state TEXT,
                    zip_code INTEGER,
                    country TEXT,
                    reference INTEGER,
                    category TEXT
                )`);
                console.log("Created database successfully");
                readStream.on("data", function(row) {
                    // code works up to here, missing rows upon insertion
                    db.run(`INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10]]);      
                resolve();
                });
            });
        }
    });
};

// Function #2: Query DB for relevant data and store in memory
function pullData () {
    return new Promise(function(resolve, reject) {
        const db = new sqlite3.Database('./db/' + userFileName + '.db');
        db.all('SELECT date, description, amount, category FROM transactions ORDER BY date DESC', function(err, rows) {
            rows.forEach(function (row) {
                queryResults.push(row);
            resolve();
            });
        });
    });
};

// Function #3: Pull data for categorizing expenses from this statement
function categorizeData () {
    return new Promise(function(resolve, reject) {
        const db = new sqlite3.Database('./db/' + userFileName + '.db');
        // Create array of objects with distinct categories
        db.all('SELECT DISTINCT category FROM transactions EXCEPT SELECT DISTINCT category FROM transactions WHERE category = "" OR category LIKE "%adjustments%"', function(err, rows) {
            rows.forEach(function (row) {
                categories.push(row);
            // resolve();
            });
        // Loop through categories and add an amounts value
        for (let i = 0; i < categories.length; i++) {
            categories[i].totalSpend = 0;
        }
        // Loop through both categories and queryResults arrays to calculate amounts
        for (let i = 0; i < categories.length; i++) {
            for (let j = 0; j < queryResults.length; j++) {
                if (categories[i].category == queryResults[j].category) {
                    // Add transaction amount from queryResults array to totalSpend value in categories array, round off
                    categories[i].totalSpend += queryResults[j].amount;
                    categories[i].totalSpend = Math.round((categories[i].totalSpend) * 100) / 100;
                };
            };
        };
        // Loop through categories and add percentage value
        for (let i = 0; i < categories.length; i++) {
            categories[i].percent = 0;
        };
        // Calculate % spend based on categories and display in another table
        let sum = 0;
        for (let i = 0; i < categories.length; i++) {
            sum += categories[i].totalSpend;
        };
        for (let i = 0; i < categories.length; i++) {
            let percentage = (categories[i].totalSpend)/sum;
            // round off and show as a percentage
            categories[i].percent = (Math.round(percentage * 100));
        }
        });
        resolve();
    });
};

// Function #4: render and serve up list of files in directory
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

// Endpoint #1 - send list of transactions to front end
function transactionData () {
    app.get('/transactions', (req, res) => {
        res.status(200);
        res.send(queryResults);
    });
};

// Endpoint #2 - send category data to front end
function categorizationData () {
    app.get('/categorization', (req, res) => {
        res.status(200);
        res.send(categories);
    });
};

// Endpoint #2 - send category data to front end
function fileData () {
    app.get('/files', (req, res) => {
        res.status(200);
        res.send(dbFiles);
    });
};

// Run Function: calls 3 main functions using async/await
async function runFunctions () {
    // code pauses execution and waits for each function to return a promise. When resolve is returned, execution continues to next line
    await readData();
    await pullData();
    await categorizeData();
    await filesInFolder();
    // Functions that send data to front end:
    transactionData();
    categorizationData();
    fileData();
};

runFunctions();