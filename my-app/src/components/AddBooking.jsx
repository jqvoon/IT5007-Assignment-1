import { useState } from 'react';
import { useAppContext } from '../context/appContext';
import { reservationTemplate } from '../context/appContext';
import './AddBooking.css';

const CATEGORIES = ['gold', 'silver'];

const generateReservationId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `RES-${rand}`;
};

const getRandomEmptySeat = (seatData, fullName) => {
  const emptySeats = seatData.filter(seat => seat.reservedBy === null);
  if (emptySeats.length === 0) return null;

  // Check if this person has booked before
  const previousSeats = seatData
    .filter(seat => seat.reservedBy === fullName)
    .map(seat => seat.seatNumber);

  if (previousSeats.length > 0) {
    // Find empty seats adjacent to any of their previous seats
    const nearbyEmptySeats = emptySeats.filter(seat =>
      previousSeats.some(prev => Math.abs(seat.seatNumber - prev) <= 1)
    );

    // If nearby seats exist, pick randomly from those — otherwise fall back to any empty seat
    if (nearbyEmptySeats.length > 0) {
      return nearbyEmptySeats[Math.floor(Math.random() * nearbyEmptySeats.length)];
    }
  }

  // New booker or no nearby seats available — pick any empty seat
  return emptySeats[Math.floor(Math.random() * emptySeats.length)];
};

const AddBooking = () => {
  const { seatData, setSeatData, setReservationData } = useAppContext();

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    category: '',
  });

  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message, seatNumber }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSeats = seatData.filter(s => s.reservedBy === null).length;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!form.fullName.trim()) {
      setStatus({ type: 'error', message: 'Please enter a full name.' });
      return;
    }
    if (!form.phoneNumber.trim()) {
      setStatus({ type: 'error', message: 'Please enter a phone number.' });
      return;
    }
    if (!form.category) {
      setStatus({ type: 'error', message: 'Please select a ticket category.' });
      return;
    }
    if (availableSeats === 0) {
      setStatus({ type: 'error', message: 'No seats available. The event is fully booked.' });
      return;
    }

    setIsSubmitting(true);

    // Pick a random empty seat
    const assignedSeat = getRandomEmptySeat(seatData);

    // Build new reservation
    const newReservation = {
      ...reservationTemplate,
      reservationId: generateReservationId(),
      fullName: form.fullName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      seatNumber: assignedSeat.seatNumber,
      category: form.category,
      reservationTimestamp: new Date().toISOString(),
    };

    // Update seatData — mark seat as reserved
    setSeatData(prev =>
      prev.map(seat =>
        seat.seatNumber === assignedSeat.seatNumber
          ? { ...seat, reservedBy: form.fullName.trim(), category: form.category }
          : seat
      )
    );

    // Update reservationData
    setReservationData(prev => [...prev, newReservation]);

    // Show success
    setStatus({
      type: 'success',
      message: `Booking confirmed! Seat ${assignedSeat.seatNumber} (${form.category}) assigned to ${form.fullName.trim()}.`,
      reservationId: newReservation.reservationId,
      seatNumber: assignedSeat.seatNumber,
    });

    // Reset form
    setForm({ fullName: '', phoneNumber: '', category: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="bookseat-wrapper">
      <div className="bookseat-card">

        <div className="bookseat-header">
          <h2 className="bookseat-title">Book a Seat</h2>
          <span className="bookseat-availability">
            <span className={`availability-dot ${availableSeats === 0 ? 'dot-full' : 'dot-open'}`} />
            {availableSeats} seat{availableSeats !== 1 ? 's' : ''} remaining
          </span>
        </div>

        <p className="bookseat-note">
          One ticket per booking. A seat will be randomly assigned from available seats.
        </p>

        {status && (
          <div className={`bookseat-status bookseat-status--${status.type}`}>
            {status.type === 'success' ? (
              <>
                <span className="status-icon">✓</span>
                <div className="status-text">
                  <strong>{status.message}</strong>
                  <span className="status-id">Reservation ID: {status.reservationId}</span>
                </div>
              </>
            ) : (
              <>
                <span className="status-icon">✕</span>
                <span>{status.message}</span>
              </>
            )}
          </div>
        )}

        <div className="bookseat-form">
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="form-input"
              placeholder="e.g. Marcus Ng"
              value={form.fullName}
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
              placeholder="e.g. +65 8XXX 8XXX"
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ticket Category</label>
            <div className="category-options">
              {CATEGORIES.map(cat => (
                <label
                  key={cat}
                  className={`category-option category-option--${cat} ${form.category === cat ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={form.category === cat}
                    onChange={handleChange}
                  />
                  <span className="category-label">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            className="bookseat-submit"
            onClick={handleSubmit}
            disabled={isSubmitting || availableSeats === 0}
          >
            {availableSeats === 0 ? 'Sold Out' : 'Confirm Booking'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddBooking
