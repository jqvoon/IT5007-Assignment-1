import { useAppContext } from '../context/appContext';
import './DisplayAttendee.css';

const DisplayAttendee = () => {
  const { reservationData } = useAppContext();

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    const date = new Date(ts);
    return date.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="attendees-wrapper">
      {reservationData.length === 0 ? (
        <div className="attendees-empty">
          <span>No reservations yet.</span>
        </div>
      ) : (
        <div className="attendees-table-container">
          <table className="attendees-table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Name</th>
                <th>Seat No.</th>
                <th>Category</th>
                <th>Booked At</th>
              </tr>
            </thead>
            <tbody>
              {reservationData.map((reservation) => (
                <tr key={reservation.reservationId}>
                  <td className="td-id">
                    <span className="reservation-id">{reservation.reservationId}</span>
                  </td>
                  <td className="td-name">{reservation.fullName}</td>
                  <td className="td-seat">
                    <span className="seat-badge">{reservation.seatNumber}</span>
                  </td>
                  <td className="td-category">
                    <span className={`category-pill category-pill--${reservation.category}`}>
                      {reservation.category?.charAt(0).toUpperCase() + reservation.category?.slice(1)}
                    </span>
                  </td>
                  <td className="td-timestamp">
                    {formatTimestamp(reservation.reservationTimestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DisplayAttendee
