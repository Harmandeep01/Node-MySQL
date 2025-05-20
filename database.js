import dotenv from 'dotenv'
dotenv.config();

import mysql from 'mysql2'

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password: process.env.DB_PASSWORD,
    database : 'notes_app'
}).promise()

async function getNotes() {
    const [rows] = await pool.query('SELECT * FROM notes')
    return rows;
}

const notes = await getNotes();
console.log(notes)
