const express = require("express");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", postRoutes);

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
