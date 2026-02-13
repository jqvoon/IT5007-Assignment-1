import { useState } from 'react'
import NavBar from './components/NavBar';
import './App.css'

const App = () => {
  const defaultview = import.meta.env.VITE_REACT_DEFAULT_VIEW || 'seatMap';
  const [currentView, setCurrentView] = useState(defaultview)
  
  return (
    <>
    <NavBar currentView={currentView} setCurrentView={setCurrentView}/>
    {/* navbar + available Tickets
    SeatMap
    Attendees
    Book Seat
    Delete Booking */}
    </>
  )
}

export default App
