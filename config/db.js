require('dotenv').config();
const mysql = require('mysql2/promise');

var pool2 = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbpontoti'
});

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL
});

module.exports = pool;