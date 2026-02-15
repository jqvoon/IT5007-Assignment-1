import { useState } from 'react'
import NavBar from './components/NavBar';
import SeatMap from './components/SeatMap';
import DisplayAttendee from './components/DisplayAttendee';
import AddBooking from './components/AddBooking';
import DeleteBooking from './components/DeleteBooking';
import './App.css'

const App = () => {
  const defaultview = import.meta.env.VITE_REACT_DEFAULT_VIEW || 'seatMap';
  const [currentView, setCurrentView] = useState(defaultview)
  
  return (
    <>
    <NavBar currentView={currentView} setCurrentView={setCurrentView}/>
    {currentView === "seatMap" && <SeatMap/>}
    {currentView === "attendees" && <DisplayAttendee/>}
    {currentView === "bookSeat" && <AddBooking/>}
    {currentView === "deleteBooking" && <DeleteBooking/>}
    </>
  )
}

export default App
