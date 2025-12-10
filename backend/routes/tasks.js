const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// POST /api/tasks
router.post("/", async (req, res) => {
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
router.get("/", async (req, res) => {
  try{
    const tasks = await Task.find();
    res.json(tasks);
  }
  catch (err){
    res.status(500).json({message: err.message});
  }
});

// GET /api/tasks/:id
router.get("/:id", async (req, res) => {
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
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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

module.exports = router;