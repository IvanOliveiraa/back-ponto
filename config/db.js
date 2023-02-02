const mysql = require('mysql2/promise');

var pool2 = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbpontoti'
});
var pool = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b046385ef31523',
    password: 'e3efbf08',
    database: 'heroku_f8bf57cf470a769'
});

module.exports = pool;