import React, { useState, useEffect } from 'react';

const emptyForm = {
  guestName: '',
  roomNumber: '',
  roomType: 'single',
  checkIn: '',
  checkOut: '',
  status: 'pending',
  totalPrice: '',
  specialRequests: ''
};

const ROOM_PRICES = { single: 80, double: 120, suite: 250, deluxe: 180 };

function BookingForm({ booking, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (booking) {
      setForm({
        guestName: booking.guestName,
        roomNumber: booking.roomNumber,
        roomType: booking.roomType,
        checkIn: booking.checkIn.slice(0, 10),
        checkOut: booking.checkOut.slice(0, 10),
        status: booking.status,
        totalPrice: booking.totalPrice,
        specialRequests: booking.specialRequests || ''
      });
    }
  }, [booking]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if ((name === 'checkIn' || name === 'checkOut' || name === 'roomType') && updated.checkIn && updated.checkOut) {
        const nights = Math.max(1, Math.ceil((new Date(updated.checkOut) - new Date(updated.checkIn)) / 86400000));
        updated.totalPrice = nights * ROOM_PRICES[updated.roomType];
      }
      return updated;
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{booking ? 'Edit Booking' : 'New Booking'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Guest Name</label>
            <input name="guestName" value={form.guestName} onChange={handleChange} placeholder="Full name" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Room Number</label>
              <input name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="e.g. 101" required />
            </div>
            <div className="form-group">
              <label>Room Type</label>
              <select name="roomType" value={form.roomType} onChange={handleChange}>
                <option value="single">Single ($80/night)</option>
                <option value="double">Double ($120/night)</option>
                <option value="deluxe">Deluxe ($180/night)</option>
                <option value="suite">Suite ($250/night)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Check In</label>
              <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Check Out</label>
              <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="checked-out">Checked Out</option>
              </select>
            </div>
            <div className="form-group">
              <label>Total Price (rupees)</label>
              <input type="number" name="totalPrice" value={form.totalPrice} onChange={handleChange} placeholder="0" required min="0" />
            </div>
          </div>

          <div className="form-group">
            <label>Special Requests</label>
            <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} placeholder="Any special requests..." rows={2} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
              {loading ? 'Saving...' : booking ? 'Update Booking' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
