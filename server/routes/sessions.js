const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// POST /api/sessions
router.post("/", async (req, res) => {
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
router.get("/", async (req, res) =>{
  try{
    const sessions = await Session.find().populate('taskId');

    res.json(sessions);
  }
  catch (err){
    res.status(500).json({message: err.message})
  }
});

module.exports = router;