const express = require('express');
const User = require('../models/user');
require('../db/mongoose');
const { hashPassword } = require('../utils/hashpassword');
const auth = require('../middleware/auth');

const router = express.Router(); 

router.post('/', async (req, res) => {
  try{
    const user = new User(req.body);
    user.password = await hashPassword(user.password);
    await user.save(user);
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});
  }catch(e) {
    res.status(500).send(e);
  }
});

router.post("/login", async (req, res) => {
  try{
    const { email,password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  }catch(e){
    res.status(404).send();
  }
});

router.get('/me', auth, async (req, res) => {
  res.status(200).send(req.user);
});

router.get('/:id', async (req, res) => {
  try {
    const { id: _id } = req.params;
    const user = await User.findById(_id);
    if(!user){
      res.status(404).send();
    }
    res.status(200).send(user);  
  }catch(e){
    res.status(500).send(e);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const {id: _id} = req.params;
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true});
    if(!user){
      res.status(404).send();
    }
    res.send(user);
  }catch(e){
    res.status(500).send(e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id:_id } = req.params;
    const user = await User.findByIdAndDelete(_id);
    if(!user){
      res.status(404).send();
    }
    res.send(user);
  }catch(e){
    res.status(500).send(e);
  }
});

module.exports = router;