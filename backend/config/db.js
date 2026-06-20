const mysql = require("mysql2");
require("dotenv").config();

let db;
if (process.env.DATABASE_URL) {
    db = mysql.createConnection(process.env.DATABASE_URL);
} else {
    db = mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_NAME || "inventory_db"
    });
}

db.connect((err) => {
    if(err){
        console.log("Database Connection Failed");
        console.log(err);
    }
    else{
        console.log("MySQL Connected Successfully");
    }
});

module.exports = db;