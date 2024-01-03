const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    user: { type: mongoose.Schema.Types.ObjectId }, // many users can boook thesame place, so no need to ref the user
    // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // owner of the property or agent that listed it
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // user
    // owner: { type: String }, // owner of the property or agent that listed it
    checkIn: { type: Date },
    checkOut: { type: Date },
    name: { type: String },
    numberOfGuests: { type: String },
    phone: { type: String },
    numberOfNights: Number,
    price: Number,
    totalPrice: Number,
    paymentMethod: { type: String },
    status: { type: String, default: 'Pending' }, // completed, cancel, active, inactive
    depositStatus: { type: String, default: 'Pending' }, // Pending, Unpaid, Paid, 
    paymentStatus: { type: String, default: 'Pending' }, // Pending, Unpaid, Paid, 
    approval: { type: String, default: 'No' }, // Yes, No

  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

// paymentMethod
