const db = require("../config/db");

const createPostTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`;

  db.run(sql, (err) => {
    if (err) {
      console.error("Error creating posts table:", err.message);
    } else {
      console.log("Posts table created.");
    }
  });
};

createPostTable();
