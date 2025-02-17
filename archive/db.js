const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const folderpath = "/Users/avikumar/Desktop/VS Code/expense_tracker_app/";
const filepath = folderpath + "transactions.db";



// Connect to and create database
function connectToDatabase() {
    if (fs.existsSync(filepath)) {
        console.log('Database already exists');
        return new sqlite3.Database(filepath);
    }
    else {
        const db = new sqlite3.Database(filepath, (error) => {
            if (error) {
                return console.error(error.message);
            }
            createTable(db);
            console.log("Connected to database successfully");
        });
        return db;
    }
}

function createTable(db) {
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
    )
    `);
}

// Export so this can be used in other files
module.exports = connectToDatabase();