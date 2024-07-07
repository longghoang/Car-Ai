const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegisterSchema = new Schema(
{
  loginAttempts: { type: Number, default: 0 },
  email: { type: String },
  password: { 
    type: String ,
    require: true,
    minlength:8
  },
  created_at: {
    type: Date,
    default: Date.now
  }
},
{
  collection: 'User'
}
);

module.exports = mongoose.model('User', RegisterSchema);