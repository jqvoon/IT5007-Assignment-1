import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NavBar from '../../components/NavBar'

// ── Mock CSS ──────────────────────────────────────────────
vi.mock('../../components/NavBar.css', () => ({}))

// ── Mock AvailableTickets — keep NavBar tests isolated ────
vi.mock('../../components/AvailableTickets', () => ({
  default: () => <div data-testid="available-tickets">10 / 50 seats available</div>
}))

// ── Mock context ──────────────────────────────────────────
vi.mock('../../context/appContext', () => ({
  useAppContext: () => ({
    seatData: [],
    setSeatData: vi.fn(),
    reservationData: [],
    setReservationData: vi.fn(),
  })
}))

const renderNavBar = (currentView = 'seatMap', setCurrentView = vi.fn()) => {
  return render(
    <NavBar currentView={currentView} setCurrentView={setCurrentView} />
  )
}

describe('NavBar', () => {
  // ── Positive tests ──────────────────────────────────
  describe('positive', () => {

    it('renders the logo title', () => {
      renderNavBar()
      expect(screen.getByText('Concert Desk')).toBeInTheDocument()
    })

    it('renders the logo subtitle', () => {
      renderNavBar()
      expect(screen.getByText('Limited Seat Reservation System')).toBeInTheDocument()
    })

    it('renders all 4 nav buttons', () => {
      renderNavBar()
      expect(screen.getByText('Seat Map')).toBeInTheDocument()
      expect(screen.getByText('Attendees')).toBeInTheDocument()
      expect(screen.getByText('Book Seat')).toBeInTheDocument()
      expect(screen.getByText('Delete Booking')).toBeInTheDocument()
    })

    it('applies active class to the current view button', () => {
      renderNavBar('attendees')
      const activeBtn = screen.getByText('Attendees').closest('button')
      expect(activeBtn).toHaveClass('active')
    })

    it('calls setCurrentView with correct id when a button is clicked', () => {
      const setCurrentView = vi.fn()
      renderNavBar('seatMap', setCurrentView)
      fireEvent.click(screen.getByText('Attendees'))
      expect(setCurrentView).toHaveBeenCalledWith('attendees')
    })

    it('calls setCurrentView for every nav button', () => {
      const setCurrentView = vi.fn()
      renderNavBar('seatMap', setCurrentView)
      fireEvent.click(screen.getByText('Seat Map'))
      fireEvent.click(screen.getByText('Attendees'))
      fireEvent.click(screen.getByText('Book Seat'))
      fireEvent.click(screen.getByText('Delete Booking'))
      expect(setCurrentView).toHaveBeenCalledTimes(4)
      expect(setCurrentView).toHaveBeenCalledWith('seatMap')
      expect(setCurrentView).toHaveBeenCalledWith('attendees')
      expect(setCurrentView).toHaveBeenCalledWith('bookSeat')
      expect(setCurrentView).toHaveBeenCalledWith('deleteBooking')
    })

    it('renders the AvailableTickets component', () => {
      renderNavBar()
      expect(screen.getByTestId('available-tickets')).toBeInTheDocument()
    })

    it('does not apply active class to inactive buttons', () => {
      renderNavBar('seatMap')
      const attendeesBtn = screen.getByText('Attendees').closest('button')
      const bookSeatBtn  = screen.getByText('Book Seat').closest('button')
      const deleteSeatBtn  = screen.getByText('Delete Booking').closest('button')
      expect(attendeesBtn).not.toHaveClass('active')
      expect(bookSeatBtn).not.toHaveClass('active')
      expect(deleteSeatBtn).not.toHaveClass('active')
    })

    it('does not call setCurrentView when no button is clicked', () => {
      const setCurrentView = vi.fn()
      renderNavBar('seatMap', setCurrentView)
      expect(setCurrentView).not.toHaveBeenCalled()
    })

    it('does not render unknown nav items', () => {
      renderNavBar()
      expect(screen.queryByText('Home')).not.toBeInTheDocument()
      expect(screen.queryByText('Settings')).not.toBeInTheDocument()
    })
  })
})
