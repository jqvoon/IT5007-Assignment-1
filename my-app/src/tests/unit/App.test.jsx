import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../../App'

// mock the context so the import resolves without errors
vi.mock('../../context/appContext', () => ({
  default: ({ children }) => <>{children}</>,  // mock the Provider
  useAppContext: () => ({                        // mock the hook
    seatData: [],
    setSeatData: vi.fn(),
    reservationData: [],
    setReservationData: vi.fn(),
  })
}))

// Mock all child components so we only test App's logic
vi.mock('../../components/NavBar', () => ({
  default: ({ currentView, setCurrentView }) => (
    <div>
      <span data-testid="current-view">{currentView}</span>
      <button onClick={() => setCurrentView('seatMap')}>Seat Map</button>
      <button onClick={() => setCurrentView('attendees')}>Attendees</button>
      <button onClick={() => setCurrentView('bookSeat')}>Book Seat</button>
      <button onClick={() => setCurrentView('deleteBooking')}>Delete Booking</button>
    </div>
  )
}))

vi.mock('../../components/SeatMap',      () => ({ default: () => <div>SeatMap</div> }))
vi.mock('../../components/DisplayAttendee', () => ({ default: () => <div>DisplayAttendee</div> }))
vi.mock('../../components/AddBooking',   () => ({ default: () => <div>AddBooking</div> }))
vi.mock('../../components/DeleteBooking',() => ({ default: () => <div>DeleteBooking</div> }))

describe('App navigation', () => {

  it('renders SeatMap as the default view', () => {
    render(<App />)
    expect(screen.getByText('SeatMap')).toBeInTheDocument()
  })

  it('shows Attendees view when attendees is selected', () => {
    render(<App />)
    fireEvent.click(screen.getByText('Attendees'))
    expect(screen.getByText('DisplayAttendee')).toBeInTheDocument()
    expect(screen.queryByText('SeatMap')).not.toBeInTheDocument()
  })

  it('shows AddBooking view when bookSeat is selected', () => {
    render(<App />)
    fireEvent.click(screen.getByText('Book Seat'))
    expect(screen.getByText('AddBooking')).toBeInTheDocument()
  })

  it('shows DeleteBooking view when deleteBooking is selected', () => {
    render(<App />)
    fireEvent.click(screen.getByText('Delete Booking'))
    expect(screen.getByText('DeleteBooking')).toBeInTheDocument()
  })

  it('only renders one view at a time', () => {
    render(<App />)
    fireEvent.click(screen.getByText('Attendees'))
    expect(screen.queryByText('SeatMap')).not.toBeInTheDocument()
    expect(screen.queryByText('AddBooking')).not.toBeInTheDocument()
    expect(screen.queryByText('DeleteBooking')).not.toBeInTheDocument()
  })

})
