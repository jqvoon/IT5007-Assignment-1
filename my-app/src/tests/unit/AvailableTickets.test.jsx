import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AvailableTickets from '../../components/AvailableTickets'

// ── Mock CSS ──────────────────────────────────────────────
vi.mock('../../components/NavBar.css', () => ({}))

// ════════════════════════════════════════════════════════
// AVAILABLE TICKETS TESTS
// ════════════════════════════════════════════════════════

// ── Mock context once with a controllable fn ──────────────
const mockUseAppContext = vi.fn()

vi.mock('../../context/appContext', () => ({
  useAppContext: () => mockUseAppContext()
}))

// ── Helper — set seatData before each test ────────────────
const renderWithSeats = (seats) => {
  mockUseAppContext.mockReturnValue({ seatData: seats })
  return render(<AvailableTickets />)
}

describe('AvailableTickets', () => {
  // ── Positive tests ──────────────────────────────────
  describe('positive', () => {

    it('shows correct remaining count when some seats are taken', () => {
      renderWithSeats([
        { seatNumber: 1, reservedBy: null },
        { seatNumber: 2, reservedBy: 'Alice' },
        { seatNumber: 3, reservedBy: null },
      ])
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('shows correct total seat count', () => {
      renderWithSeats([
        { seatNumber: 1, reservedBy: null },
        { seatNumber: 2, reservedBy: 'Alice' },
        { seatNumber: 3, reservedBy: null },
      ])
      expect(screen.getByText('/ 3 seats available')).toBeInTheDocument()
    })

    it('shows 0 remaining when all seats are booked', () => {
      renderWithSeats([
        { seatNumber: 1, reservedBy: 'Alice' },
        { seatNumber: 2, reservedBy: 'Bob' },
      ])
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('shows full count when no seats are booked', () => {
      renderWithSeats([
        { seatNumber: 1, reservedBy: null },
        { seatNumber: 2, reservedBy: null },
        { seatNumber: 3, reservedBy: null },
      ])
      expect(screen.getByText('3')).toBeInTheDocument()
    })
 
    it('handles a single seat correctly', () => {
      renderWithSeats([{ seatNumber: 1, reservedBy: null }])
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('/ 1 seat available')).toBeInTheDocument()
    })

        it('does not display names of people who reserved seats', () => {
      renderWithSeats([
        { seatNumber: 1, reservedBy: 'Alice' },
        { seatNumber: 2, reservedBy: null },
      ])
      expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    })
  })
})
