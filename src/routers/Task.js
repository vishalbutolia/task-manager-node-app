const express = require('express');
const Task = require('../models/task');
require('../db/mongoose');

const router = express.Router();

router.post('/', async (req, res) => {
  try{
    const task = new Task(req.body);
    await task.save(task);
    res.status(201).send(task);
  }catch(e){
    res.status(500).send(e);
  }
});

router.get('/', async (req, res) => {
  try{
    const tasks = await Task.find({});  
    res.status(200).send(tasks);
  }catch(e){
    res.status(500).send(e);
  }
});

router.get('/tasks/:id', async (req, res) => {
  try{
    const { id:_id } = req.params;
    const task = await Task.findById(_id);
    res.status(200).send(task);  
  }catch(e){
    res.status(500).send(e);  
  }
});

router.patch('/:id', async (req, res) => {
  const allowedUpdates = ['description', 'completed'];
  try{
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if(!isValidOperation){
      res.status(400).send("Invalid updates!");
    }
    const { id:_id } = req.params;
    const task = await Task.findById(_id);
    if(!task){
      res.status(404).send();
    }
    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.status(200).send(task);  
  }catch(e){
    res.status(500).send(e);  
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const { id:_id } = req.params;
    const task = await Task.findByIdAndDelete(_id);
    if(!task){
      res.status(404).send();
    }
    res.status(200).send(task);  
  }catch(e){
    res.status(500).send(e);  
  }
});

module.exports = router;