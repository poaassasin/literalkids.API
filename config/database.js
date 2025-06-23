// File: config/database.js

const mysql = require("mysql2");
require('dotenv').config();

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
        // --- TAMBAHAN PENTING UNTUK POOLING ---
        waitForConnections: true,
        connectionLimit: 10, // Jumlah maksimum koneksi dalam pool
        queueLimit: 0
    };
} else {
    // Konfigurasi untuk Lokal (membaca dari file .env)
    console.log('Running in development mode. Using LOCAL database configuration.');
    connectionConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'literalkids_db2',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
}

// `createConnection` membuat satu koneksi yang bisa mati.
// `createPool` membuat sebuah 'manajer' koneksi yang tangguh.
const pool = mysql.createPool(connectionConfig);

module.exports = pool;`
