require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//creating the main server object
const app = express();
//decide where it will run
const PORT = process.env.PORT || 3001;

// Middleware (allows json requests to be used)
app.use(express.json());

/*
app.use(
  cors({}
    origin: process.env.CLIENT_ORIGIN,
  })
)
*/

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

// POST /api/tasks
app.post("/api/tasks", async (req, res) => {
  try{
    const task = new Task({
      title: req.body.title
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  }
  catch (err){
    res.status(400).json({message: err.message});
  }
});

// GET /api/tasks
app.get("/api/tasks", async (req, res) => {
  try{
    const tasks = await Task.find();
    res.json(tasks);
  }
  catch (err){
    res.status(500).json({message: err.message});
  }
});

// GET /api/tasks/:id
app.get("/api/tasks/:id", async (req, res) => {
  try{
    const specificTask = await Task.findById(req.params.id);
    
    if(!specificTask){
      return res.status(404).json({message: "Task not found"});
    }

    res.json(specificTask);
  }
  catch (err){
    res.status(500).json({message: err.message});
  }
});

// PUT /api/tasks/:id
app.put("/api/tasks/:id", async (req, res) => {
  try{
    const changedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );

    if(!changedTask){
      return res.status(404).json("Task not found");
    }

    res.json(changedTask);
  }
  catch (err){
    if(err.name === "ValidationError"){
      return res.status(400).json({message: err.message});
    }

    res.status(500).json({message: err.message});
  }
});

// DELETE /api/tasks/:id
app.delete("/api/tasks/:id", async (req, res) => {
  try{
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if(!deletedTask){
      return res.status(404).json("Task not found");
    }

    res.json({"message": "Task deleted successfully", "task": deletedTask});
  }
  catch (err){
    res.status(500).json({message: err.message});
  }
});

// TODO: Add your Session routes here
// POST /api/sessions
app.post("/api/sessions", async (req, res) => {
  try{
    const createdSession = new Session({
      taskId: req.body.taskId,
      duration: req.body.duration,
      startTime: req.body.startTime,
      completed: req.body.completed
    });

    const savedSession = await createdSession.save();

    res.status(201).json({message: "Session created", session: savedSession})
  }
  catch (err){
    res.status(400).json({message: err.message})
  }
});

// GET /api/sessions
app.get("/api/sessions", async (req, res) =>{
  try{
    const sessions = await Session.find().populate('taskId');

    res.json(sessions);
  }
  catch (err){
    res.status(500).json({message: err.message})
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
