const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guestName: { type: String, required: true, trim: true },
  roomNumber: { type: String, required: true },
  roomType: { type: String, enum: ['single', 'double', 'suite', 'deluxe'], default: 'single' },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'checked-out'], default: 'pending' },
  totalPrice: { type: Number, required: true },
  specialRequests: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
