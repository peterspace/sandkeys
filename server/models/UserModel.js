const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    accountId: String,
    provider: String,
    name: String,
    email: { type: String, unique: true },
    // email: { type: String },
    password: String,
    photo: {
      type: String,
      default: 'https://i.ibb.co/4pDNDk1/avatar.png',
    },
    role: String, // "Admin", "User", 'Partner'
    cart: {
      type: Array,
      default: [],
    },
    // wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    wishlist: [{ placeId: String, roomNumber: String }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
