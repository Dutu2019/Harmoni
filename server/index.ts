import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
const app = express();

// Set up the database
const db = new sqlite3.Database("db.sqlite3", (err) => {
  if (err) {
    console.error("Database error: ", err.message);
  } else {
    console.log("Connected to database.");
  }
});

db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      );
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Users table created or already exists.');
      }
    })});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
});