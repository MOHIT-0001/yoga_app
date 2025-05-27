const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
    favouriteYoga: { type: [String], default: [] },
  favouriteMusic: { type: [String], default: [] },
  previousYogaSessions: {
  type: [
    {
      type: Map,
      of: String
    }
  ],
  default: []
}
});

const User = mongoose.model('User', userSchema);
module.exports = User;
