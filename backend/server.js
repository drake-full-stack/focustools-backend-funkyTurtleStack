require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//creating the main server object
const app = express();
//decide where it will run
const PORT = process.env.PORT || 3001;

// Middleware (allows json requests to be used)
app.use(express.json());

// Middleware logs requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// allow cross origin requests
app.use(cors());

app.use(
  cors({
    origin: [
      "http://localhost:5173",               // Vite local dev
      process.env.CLIENT_ORIGIN,            // Netlify URL
    ],
  })
);

// Import Routes
const taskRoutes = require("./routes/tasks");
const sessionRoutes = require("./routes/sessions");

//Use routes
app.use("/tasks", taskRoutes);
app.use("/sessions", sessionRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error:", error));

// Import models from mangoDB
const Task = require("./models/Task");
const Session = require("./models/Session");


// Root route
app.get("/", (req, res) => {
  res.json({
    message: "FocusTools API",
    status: "Running",
    endpoints: {
      tasks: "/api/tasks",
      sessions: "/api/sessions",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});