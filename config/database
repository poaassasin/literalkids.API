// File: config/database.js

const mysql = require("mysql2");

let connectionConfig;

// Cek environment. Railway secara otomatis mengatur NODE_ENV menjadi 'production'.
if (process.env.NODE_ENV === 'production') {
    // Konfigurasi untuk Railway
    console.log('Running in production mode. Using RAILWAY database configuration.');
    connectionConfig = {
        host: process.env.MYSQLHOST,
        port: process.env.MYSQLPORT,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
    };
} else {
    // Konfigurasi untuk Lokal (membaca dari file .env)
    console.log('Running in development mode. Using LOCAL database configuration.');
    connectionConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '', // Kosongkan password jika di lokal tidak pakai
        database: process.env.DB_NAME || 'literalkids_db2',
    };
}

const db = mysql.createConnection(connectionConfig);

db.connect((err) => {
    if (err) {
        console.error('DATABASE CONNECTION FAILED:', err.stack);
        return;
    }
    console.log('Database connected successfully as ID ' + db.threadId);
});

module.exports = db;
