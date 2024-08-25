const db = require("../config/db");

// Get all posts
exports.getAllPosts = (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: "Failed to retrieve posts" });
    } else {
      res.json(rows);
    }
  });
};

// Get a post by ID
exports.getPostById = (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ message: "Failed to retrieve post" });
    } else if (!row) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.json(row);
    }
  });
};

// Create a new post
exports.createPost = (req, res) => {
  const { title, excerpt, content, picture_url } = req.body;
  db.run(
    "INSERT INTO posts (title, excerpt, content, picture_url) VALUES (?, ?, ?, ?)",
    [title, excerpt, content, picture_url],
    function (err) {
      if (err) {
        res.status(500).json({ message: "Failed to create post" });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
};

// Update a post
exports.updatePost = (req, res) => {
  const { id } = req.params;
  const { title, excerpt, content, picture_url } = req.body;
  db.run(
    "UPDATE posts SET title = ?, excerpt = ?, content = ?, picture_url = ? WHERE id = ?",
    [title, excerpt, content, picture_url, id],
    function (err) {
      if (err) {
        res.status(500).json({ message: "Failed to update post" });
      } else if (this.changes === 0) {
        res.status(404).json({ message: "Post not found" });
      } else {
        res.status(200).json({ message: "Post updated" });
      }
    }
  );
};

// Delete a post
exports.deletePost = (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM posts WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ message: "Failed to delete post" });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(200).json({ message: "Post deleted" });
    }
  });
};
