import { useAppContext } from '../context/appContext';
import './SeatMap.css';

const SeatMap = () => {
  const seatsPerRow = parseInt(import.meta.env.VITE_REACT_SEATS_PER_ROW) || 10;
  const { seatData } = useAppContext();

  const rows = [];
  for (let i = 0; i < seatData.length; i += seatsPerRow) {
    rows.push(seatData.slice(i, i + seatsPerRow));
  }

  const getSeatClass = (seat) => {
    if (!seat.reservedBy) return 'seat seat--available';
    if (seat.category === 'gold') return 'seat seat--gold';
    if (seat.category === 'silver') return 'seat seat--silver';
    return 'seat seat--occupied';
  };

  return (
    <div className="seatmap-page">

      {/* Dark venue platform */}
      <div className="seatmap-venue">
        <div className="seatmap-stage">
          <span>STAGE</span>
        </div>

        <div className="seatmap-grid">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="seatmap-row">
              {row.map(seat => (
                <div
                  key={seat.seatNumber}
                  className={getSeatClass(seat)}
                  data-tooltip={
                    seat.reservedBy
                      ? `Seat ${seat.seatNumber} — ${seat.category?.toUpperCase()} — ${seat.reservedBy}`
                      : `Seat ${seat.seatNumber} — Available`
                  }
                >
                  <span className="seat-number">{seat.seatNumber}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend fixed to bottom of screen */}
      <div className="seatmap-legend">
        <div className="legend-item">
          <div className="legend-swatch legend-swatch--available" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch legend-swatch--gold" />
          <span>Gold</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch legend-swatch--silver" />
          <span>Silver</span>
        </div>
      </div>

    </div>
  );
}

export default SeatMap
