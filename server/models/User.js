// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
