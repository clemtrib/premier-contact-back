var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  id: String,
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
},
  {
    timestamps: { created_at: "created_at", updated_at: "updated_at" }
  }
);

module.exports = mongoose.model('User', UserSchema);