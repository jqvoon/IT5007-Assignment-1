import { useAppContext } from "../context/appContext"

const AvailableTickets = () => {
    const { seatData } = useAppContext();
    const totalSeats = seatData.length;
    const numSeatsRemaining = seatData.filter(seat => seat.reservedBy === null).length

    return (
        <div className="available-tickets">
            <span className="tickets-remaining">{numSeatsRemaining}</span>
            <span className="tickets-label"> / {totalSeats} seat{totalSeats != 1 ? 's' : ''} available</span>
        </div>
    )
}

export default AvailableTickets
