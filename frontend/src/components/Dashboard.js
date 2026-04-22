import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BookingForm from './BookingForm';

const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('hotel_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const showMessage = (msg, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3000); }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  };

  const handleCreate = async (form) => {
    setFormLoading(true);
    try {
      const { data } = await api.post('/bookings', form);
      setBookings([data, ...bookings]);
      setShowForm(false);
      showMessage('Booking created successfully!');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to create booking', true);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (form) => {
    setFormLoading(true);
    try {
      const { data } = await api.put(`/bookings/${editBooking._id}`, form);
      setBookings(bookings.map(b => b._id === data._id ? data : b));
      setEditBooking(null);
      showMessage('Booking updated successfully!');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update booking', true);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
      setDeleteConfirm(null);
      showMessage('Booking deleted.');
    } catch {
      showMessage('Failed to delete booking', true);
    }
  };

  const formatDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Booking Management</h2>
        <button className="btn btn-success" onClick={() => setShowForm(true)}>+ New Booking</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.confirmed}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <h3>No bookings yet</h3>
          <p>Click "New Booking" to add your first reservation.</p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-info">
                <h3>{booking.guestName} — Room {booking.roomNumber}</h3>
                <div className="booking-meta">
                  <span>{booking.roomType}</span>
                  <span> {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
                  <span> ${booking.totalPrice}</span>
                  <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                </div>
                {booking.specialRequests && (
                  <div style={{ fontSize: '0.85rem', color: '#888' }}> {booking.specialRequests}</div>
                )}
              </div>
              <div className="booking-actions">
                <button className="btn btn-warning btn-sm" onClick={() => setEditBooking(booking)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(booking._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BookingForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          loading={formLoading}
        />
      )}

      {editBooking && (
        <BookingForm
          booking={editBooking}
          onSubmit={handleUpdate}
          onClose={() => setEditBooking(null)}
          loading={formLoading}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>×</button>
            </div>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Are you sure you want to delete this booking? This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
