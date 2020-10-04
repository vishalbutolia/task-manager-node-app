const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
require('../db/mongoose');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try{
    const task = new Task({
      ...req.body,
      owner: req.user._id
    });
    await task.save(task);
    res.status(201).send(task);
  }catch(e){
    res.status(500).send(e);
  }
});

router.get('/', auth, async (req, res) => {
  try{
    const tasks = await Task.find({owner: req.user._id});  
    res.status(200).send(tasks);
  }catch(e){
    res.status(500).send(e);
  }
});

router.get('/:id', auth, async (req, res) => {
  try{
    const { id:_id } = req.params;
    const task = await Task.findOne({_id, owner: req.user._id});
    if(!task){
      res.status(404).send();
    }
    res.status(200).send(task);  
  }catch(e){
    res.status(500).send(e);  
  }
});

router.patch('/:id', auth, async (req, res) => {
  const allowedUpdates = ['description', 'completed'];
  try{
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if(!isValidOperation){
      return res.status(400).send({error: 'Invalid updates'});
    }
    const task = await Task.findOne({_id: req.params.id, owner:req.user._id });
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

router.delete('/:id', auth, async (req, res) => {
  try{
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: auth.user._id});
    if(!task){
      res.status(404).send();
    }
    res.status(200).send(task);  
  }catch(e){
    res.status(500).send(e);  
  }
});

module.exports = router;