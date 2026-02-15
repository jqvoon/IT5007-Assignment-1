import { useState } from 'react';
import { useAppContext } from '../context/appContext';
import './DeleteBooking.css';

export default function DeleteBooking() {
  const { reservationData, setReservationData, setSeatData } = useAppContext();

  const [form, setForm] = useState({ reservationId: '', phoneNumber: '' });
  const [found, setFound] = useState(null);   // reservation object if found
  const [status, setStatus] = useState(null); // { type, message }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus(null);
    setFound(null);
  };

  // Step 1 — look up the reservation
  const handleLookup = (e) => {
    e.preventDefault();

    if (!form.reservationId.trim() || !form.phoneNumber.trim()) {
      setStatus({ type: 'error', message: 'Please enter both Reservation ID and phone number.' });
      return;
    }

    const match = reservationData.find(
      r =>
        r.reservationId.toLowerCase() === form.reservationId.trim().toLowerCase() &&
        r.phoneNumber.trim() === form.phoneNumber.trim()
    );

    if (!match) {
      setStatus({ type: 'error', message: 'No reservation found. Please check your details.' });
      setFound(null);
      return;
    }

    setFound(match);
    setStatus(null);
  };

  // Step 2 — confirm and delete
  const handleDelete = () => {
    // Remove from reservationData
    setReservationData(prev =>
      prev.filter(r => r.reservationId !== found.reservationId)
    );

    // Free up the seat in seatData
    setSeatData(prev =>
      prev.map(seat =>
        seat.seatNumber === found.seatNumber
          ? { ...seat, reservedBy: null, category: null }
          : seat
      )
    );

    setStatus({
      type: 'success',
      message: `Reservation ${found.reservationId} cancelled.`,
    });

    // Reset everything
    setFound(null);
    setForm({ reservationId: '', phoneNumber: '' });
  };

  const handleCancelLookup = () => {
    setFound(null);
    setStatus(null);
    setForm({ reservationId: '', phoneNumber: '' });
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="delete-wrapper">
      <div className="delete-card">

        <div className="delete-header">
          <h2 className="delete-title">Cancel Booking</h2>
          <p className="delete-note">
            Enter your Reservation ID and phone number to look up your booking.
          </p>
        </div>

        {/* Status message */}
        {status && (
          <div className={`delete-status delete-status--${status.type}`}>
            <span className="status-icon">{status.type === 'success' ? '✓' : '✕'}</span>
            <span>{status.message}</span>
          </div>
        )}

        {/* Step 1 — Lookup form (hidden once found) */}
        {!found && (
          <div className="delete-form">
            <div className="form-group">
              <label className="form-label" htmlFor="reservationId">Reservation ID</label>
              <input
                id="reservationId"
                name="reservationId"
                type="text"
                className="form-input"
                placeholder="e.g. RES-AB1234"
                value={form.reservationId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="form-input"
                placeholder="Phone number used at booking"
                value={form.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <button className="delete-lookup-btn" onClick={handleLookup}>
              Look Up Booking
            </button>
          </div>
        )}

        {/* Step 2 — Confirm cancellation */}
        {found && (
          <div className="delete-confirm">
            <p className="confirm-heading">Booking found — please confirm cancellation:</p>

            <div className="confirm-card">
              <div className="confirm-row">
                <span className="confirm-key">Reservation ID</span>
                <span className="confirm-val confirm-id">{found.reservationId}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-key">Name</span>
                <span className="confirm-val">{found.fullName}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-key">Seat</span>
                <span className="confirm-val">
                  <span className="confirm-seat-badge">{found.seatNumber}</span>
                </span>
              </div>
              <div className="confirm-row">
                <span className="confirm-key">Category</span>
                <span className={`confirm-val category-pill category-pill--${found.category}`}>
                  {found.category?.charAt(0).toUpperCase() + found.category?.slice(1)}
                </span>
              </div>
              <div className="confirm-row">
                <span className="confirm-key">Booked At</span>
                <span className="confirm-val confirm-ts">{formatTimestamp(found.reservationTimestamp)}</span>
              </div>
            </div>

            <div className="confirm-actions">
              <button className="confirm-cancel-btn" onClick={handleCancelLookup}>
                Go Back
              </button>
              <button className="confirm-delete-btn" onClick={handleDelete}>
                Confirm Cancellation
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}