const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if(!validator.isEmail(value)){
        throw new Error("Not a valid email");
      }
    }
  }, 
  password: {
    type: String,
    minlength: 7,
    trim: true,
    required: true,
    validate(value) {
      if(value.toLowerCase().includes('password')){
        throw new Error('password cannot contain string "password"');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if(value < 0){
        throw new Error("Not a valid age");
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.generateAuthToken = async function(){
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'vishalbutolia'); 
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}

userSchema.statics.findByCredentials = async (email, password) => { 
  const user = await User.findOne({email});
  
  if(!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch){
    throw new Error("Unable to login");
  }
  return user;
}

const User = mongoose.model('User', userSchema);

module.exports = User;