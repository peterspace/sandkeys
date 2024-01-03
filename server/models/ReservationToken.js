const mongoose = require('mongoose');

const reservationTokenSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reservation: { // can be found by ud
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
    },
    //======={for verification}=============
    token: {
      type: String,
      required: true,
    },
    authId: String,
    createdAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const ReservationToken = mongoose.model(
  'ReservationToken',
  reservationTokenSchema
);
module.exports = ReservationToken;
