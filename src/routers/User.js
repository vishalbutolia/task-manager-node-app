const express = require('express');
const User = require('../models/user');
require('../db/mongoose');
const auth = require('../middleware/auth');

const router = express.Router(); 

router.post('/', async (req, res) => {
  try{
    const user = new User(req.body);
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

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(({token}) => token !== req.token);
    await req.user.save();
    res.status(200).send();
  }catch(e){
    res.status(500).send();
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  }catch(e){
    res.status(500).send();
  }
});

router.get('/me', auth, async (req, res) => {
  res.status(200).send(req.user);
});

router.patch("/me", auth, async (req, res) => {
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  try {
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if(!isValidOperation){
      return res.status(400).send({error: 'Invalid updates'})
    }
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  }catch(e){
    res.status(500).send(e);
  }
});

router.delete("/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  }catch(e){
    res.status(500).send(e);
  }
});

module.exports = router;