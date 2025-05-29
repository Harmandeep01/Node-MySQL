import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

async function getNotes() {
  const [rows] = await pool.query("SELECT * FROM notes");
  return rows;
}

//INSERT QUERY => C(CREATE)RUD
async function insert(title, contents) {
  const [row] = await pool.query(
    `
            INSERT INTO notes (title, contents)
            VALUES (?, ?)
            `,
    [title, contents]
  );
  const id = row.insertId;
  return getNote(id);
}

//READ QUERY => CR(READ)UD
async function getNote(id) {
  const [rows] = await pool.query(`
            SELECT * 
            FROM notes 
            WHERE id = ?
            `,
    [id]
  );
  return rows[0];
}

//UPDATE QUERY => CRU(UPDATE)D


//DELETE QUERY => CRUD(DELETE)
async function deleteFields(tableName) {
    // VERY important: validate the table name to prevent SQL injection
    const allowedTables = ['notes', 'users', 'comments']; // whitelist known tables

    if (!allowedTables.includes(tableName)) {
        throw new Error('Invalid table name');
    }

    const [result] = await pool.query(`DELETE FROM ${tableName}`);
    console.log('Affected rows:',result.affectedRows)
    return result;
}
export { getNotes, getNote, insert, deleteFields};