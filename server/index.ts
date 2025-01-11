import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const jwtSecret = "secret";
const authenticateJWT = (req: any, res: express.Response, next: express.NextFunction) => {
  jwt.verify(req.cookies.jwt, jwtSecret, (err:any, user:any) => {
    if (!err) {
      req.user = user; // Attach decoded token to request
    }
    next();
  });
};

// Set up the database
const db = new sqlite3.Database("db.sqlite3", (err) => {
  if (err) {
    console.error("Database error: ", err.message);
  } else {
    console.log("Connected to database.");
  }
});

// User accounts table
db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        role VARCHAR(8) NOT NULL CHECK (role IN ('student', 'helper')),
        password TEXT NOT NULL
      );
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Users table created or already exists.');
      }
    })
    db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      message_id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      message_text TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Messages table created or already exists.');
    }
  })
  db.run(`
    CREATE TABLE IF NOT EXISTS chats (
      chat_id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      student_username TEXT NOT NULL
  );
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Chats table created or already exists.');
    }
  })
  });

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://192.168.56.1:5173","http://172.29.6.9:5173"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(authenticateJWT);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", (req, res) => {
  const { username, password, role } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(400).json({ message: "Server-side error. We're sorry for the inconvenience." });
      return;
    } else {
      db.run(
        "INSERT INTO users (username, role, password) VALUES (?, ?, ?)",
        [username, role, hash],
        (err) => {
          if (err) {
            res.status(400).json({ message: "Error signing up. Username already exists." });
          } else {
            res.status(201).json({ message: "Account created successfully!" });
          }
        }
      );
    }
  });
});

app.post("/login", (req:any, res) => {
  if (req.user) {
    res.status(200).json(req.user);
    return;
  }
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, row:any) => {
      if (err) {
        res.status(400).json({ message: "Server-side error. We're sorry for the inconvenience." });
        return;
      }
      if (row) {
        bcrypt.compare(password, row.password, (err, result) => {
          if (result) {
            const token = jwt.sign({id: row.id, username: row.username, role: row.role }, jwtSecret, { expiresIn: "1h" });
            res.cookie("jwt", token, { httpOnly: true });
            res.status(200).json({id: row.id, username: row.username, role: row.role});
          } else {
            res.status(401).json({ message: "Invalid username or password." });
          }
        });
      } else {
        res.status(401).json({ message: "Invalid username or password." });
      }
    }
  );
});

app.get("/logout", (req, res) => {
  res.cookie("jwt", "null", { httpOnly: true });
  res.status(200).json({ message: "Logged out successfully." });
});

app.post("/create-chat", (req:any, res) => {
  if (req.user) {
    if (req.user.role === "student") {
      db.get("SELECT username FROM users WHERE id = ?", [req.user.id], (err, row:any) => {
        db.run(
          "INSERT INTO chats (student_id, student_username) VALUES (?, ?)",
          [req.user.id, row.username],
          (err) => {
            if (err) {
              res.status(400).json({ message: "Error creating chat." });
            } else {
              res.status(201).json({ message: "Chat created." });
            }
          }
        );
      })
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/chat", (req:any, res) => {
  if (req.user) {
    if (req.user.role === "student") {
      db.get(
        "SELECT chat_id FROM chats WHERE student_id = ?",
        [req.user.id],
        (err, row:any) => {
          if (row) {
            res.sendStatus(200);
          } else {
            res.status(404).json({ message: "Chat not found." });
          }
        }
      );
    } else if (req.user.role === "helper") {
      db.get(
        "SELECT * FROM chats",
        (err, rows:any) => {
          if (rows) {
            res.status(200).json(rows);
          } else {
            res.status(404).json({ message: "Chat not found." });
          }
        }
      );
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.post("/message", (req:any, res) => {
  if (req.user) {
    if (req.user.role === "student") {
      db.get(
        "SELECT chat_id FROM chats WHERE student_id = ?",
        [req.user.id],
        (err, row:any) => {
          if (row) {
            db.run(
              "INSERT INTO chat_messages (chat_id, user_id, message_text) VALUES (?, ?, ?)",
              [row.chat_id, req.user.id, req.body.message],
              (err) => {
                if (err) {
                  res.status(400).json({ message: "Error sending message." });
                } else {
                  res.status(201).json({ message: "Message sent." });
                }
              }
            );
          } else if (err) {
            console.log(err)
          }
        })
    } else if (req.user.role === "helper") {
      db.all(
        "SELECT chat_id FROM chats",
        (err, rows:any) => {
          if (rows) {
            db.run(
              "INSERT INTO chat_messages (chat_id, user_id, message_text) VALUES (?, ?, ?)",
              [rows[0].chat_id, req.user.id, req.body.message],
              (err) => {
                if (err) {
                  res.status(400).json({ message: "Error sending message." });
                } else {
                  res.status(201).json({ message: "Message sent." });
                }
              }
            );
          } else if (err) {
            console.log(err)
          }
        })
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/message", (req:any, res) => {
  if (req.user) {
    if (req.user.role === "student") {
      db.get(
        "SELECT chat_id FROM chats WHERE student_id = ?",
        [req.user.id],
        (err, row:any) => {
          if (row) {
            db.all(
              "SELECT * FROM chat_messages WHERE chat_id = ?",
              [row.chat_id],
              (err, rows) => {
                const newRows = rows.map((row:any) => {
                  if (row.user_id === req.user.id) {
                    return {id: row.message_id, text: row.message_text, sender: "user", timestamp: row.timestamp};
                  } else {
                    return {id: row.message_id, text: row.message_text, sender: "other", timestamp: row.timestamp};
                  }
                });
                res.status(200).json(newRows);
              }
            );
          }
        }
      );
    } else if (req.user.role === "helper") {
      db.all(
        "SELECT * FROM chat_messages",
        (err, rows) => {
          const newRows = rows.map((row:any) => {
            if (row.user_id === req.user.id) {
              return {id: row.message_id, text: row.message_text, sender: "user", timestamp: row.timestamp};
            } else {
              return {id: row.message_id, text: row.message_text, sender: "other", timestamp: row.timestamp};
            }
          });
          res.status(200).json(newRows);
        });
      }
    } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.listen(3000, "172.29.6.9",() => {
  console.log("Server is running");
});