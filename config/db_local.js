// import modul mysql2
const mysql = require("mysql2");

// membuat koneksi db
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',  
  password: process.env.DB_PASSWORD || 'Jovan123!',  
  database: process.env.DB_NAME || 'literalkids_db2',  
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

module.exports = db;
