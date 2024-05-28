const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Check if the password is already hashed
  const isHashed = this.password.startsWith('$2b$');
  if (isHashed) return next();

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
