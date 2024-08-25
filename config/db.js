const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../data/blog.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Could not connect to database", err);
  } else {
    console.log("Connected to database");
  }
});

// Function to check if a column exists in a table
const columnExists = (tableName, columnName, callback) => {
  db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
    if (err) {
      callback(err);
    } else {
      const columnExists = columns.some((column) => column.name === columnName);
      callback(null, columnExists);
    }
  });
};

// Add the picture_url column if it doesn't exist
columnExists("posts", "picture_url", (err, exists) => {
  if (err) {
    console.error("Error checking column existence", err);
    return;
  }

  if (!exists) {
    db.run("ALTER TABLE posts ADD COLUMN picture_url TEXT", (err) => {
      if (err) {
        console.error("Error adding column picture_url", err);
      } else {
        console.log("Column picture_url added to posts table");
      }
    });
  } else {
    console.log("Column picture_url already exists");
  }
});

// Insert dummy data if the table is empty
db.get("SELECT COUNT(*) AS count FROM posts", (err, row) => {
  if (err) {
    console.error("Error checking posts table", err);
  } else if (row.count === 0) {
    const insertQuery = `
            INSERT INTO posts (title, excerpt, content, picture_url)
            VALUES (?, ?, ?, ?)
        `;
    const dummyPosts = [
      {
        title: "First Blog Post",
        excerpt: "This is the first blog post.",
        content: "This is the content of the first blog post.",
        picture_url: "https://via.placeholder.com/150?text=First+Post",
      },
      {
        title: "Second Blog Post",
        excerpt: "This is the second blog post.",
        content: "This is the content of the second blog post.",
        picture_url: "https://via.placeholder.com/150?text=Second+Post",
      },
      {
        title: "Third Blog Post",
        excerpt: "This is the third blog post.",
        content: "This is the content of the third blog post.",
        picture_url: "https://via.placeholder.com/150?text=Third+Post",
      },
    ];

    dummyPosts.forEach((post) => {
      db.run(
        insertQuery,
        [post.title, post.excerpt, post.content, post.picture_url],
        (err) => {
          if (err) {
            console.error("Error inserting dummy post", err);
          } else {
            console.log("Inserted dummy post:", post.title);
          }
        }
      );
    });
  } else {
    console.log("Posts table already has data.");
  }
});

module.exports = db;
