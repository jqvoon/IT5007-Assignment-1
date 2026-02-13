import { useState } from 'react'
import './App.css'

const App = () => {
  const totalSeats = parseInt(import.meta.env.VITE_REACT_MAX_SEATS) || 10;
  const defaultview = import.meta.env.VITE_REACT_DEFAULT_VIEW || 'SeatMap';
  const [currentView, setCurrentView] = useState(defaultview)
  const reservationTemplate = {
      reservationId: "",
      fullName: "",
      phoneNumber: "",
      seats: []
  }
  const reservedSeatTemplate = {
      seatNumber: "",
      category: "",
      reservationTimestamp: ""
  }
  const [reservationData , setReservationData] = useState([])
  const [seatData , setSeatData] = useState([
      Array.from({ length: totalSeats }, (_, i) => ({
          seatNumber: i + 1,
          category: null,
          reservedBy: null,
      }))
  ])
  
  return (
    <>
    {/* navbar + available Tickets
    SeatMap
    Attendees
    Book Seat
    Delete Booking */}
    </>
  )
}

export default App
