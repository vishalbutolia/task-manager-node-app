const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, 'vishalbutolia');
    const user = await User.findOne({_id:data._id, "tokens.token": token});
    
    if(!user){
      throw new Error("User not found");
    }
    
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({error: 'Please authenticate.'});
  }
}

module.exports = authenticateUser;