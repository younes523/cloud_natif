const mysql = require('mysql2');
require('dotenv').config(); //loads environment variables from a .env file into process.env

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

module.exports = db; //commonJS (NOT ES6) => while importing : 'const db = require('../config/db');' (even db without extension (not like ES6))
