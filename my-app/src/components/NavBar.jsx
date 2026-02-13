import './NavBar.css';

const NAV_ITEMS = [
  { id: 'seatMap',       label: 'Seat Map',       icon: '⬡' },
  { id: 'attendees',     label: 'Attendees',      icon: '♟' },
  { id: 'bookSeat',      label: 'Book Seat',      icon: '✦' },
  { id: 'deleteBooking', label: 'Delete Booking', icon: '✕' },
];

export default function NavBar({ currentView, setCurrentView }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="navbar-logo-title">Concert Desk</span>
        <span className="navbar-logo-subtitle">Limited Seat Reservation System</span>
      </div>

      <ul className="navbar-links">
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <li key={id}>
            <button
              className={`navbar-btn ${currentView === id ? 'active' : ''}`}
              onClick={() => setCurrentView(id)}
            >
              <span className="navbar-btn-icon">{icon}</span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
