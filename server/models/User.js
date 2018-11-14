const mongoose = require('mongoose');


var User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    default: null
  },
  duration: {
    type: String,
    default: null
  },
  date: {
    type: String,
    default: null
  }
});

module.exports = {User};
