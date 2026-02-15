import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SeatMap from '../../components/SeatMap'

// ── Mock CSS ──────────────────────────────────────────────
vi.mock('../../components/SeatMap.css', () => ({}))

// ── Mock context with controllable fn ────────────────────
const mockUseAppContext = vi.fn()

vi.mock('../../context/appContext', () => ({
  useAppContext: () => mockUseAppContext()
}))

// ── Helper ────────────────────────────────────────────────
const renderWithSeats = (seats) => {
  mockUseAppContext.mockReturnValue({ seatData: seats })
  return render(<SeatMap />)
}

// ── Seed data helpers ─────────────────────────────────────
const makeSeat = (seatNumber, reservedBy = null, category = null) => ({
  seatNumber,
  reservedBy,
  category,
})

// ════════════════════════════════════════════════════════
describe('SeatMap', () => {

  it('renders the stage label', () => {
    renderWithSeats([])
    expect(screen.getByText('STAGE')).toBeInTheDocument()
  })

  it('renders the legend with all three categories', () => {
    renderWithSeats([])
    expect(screen.getByText('Available')).toBeInTheDocument()
    expect(screen.getByText('Gold')).toBeInTheDocument()
    expect(screen.getByText('Silver')).toBeInTheDocument()
  })

  it('renders the correct number of seats', () => {
    const seats = Array.from({ length: 10 }, (_, i) => makeSeat(i + 1))
    renderWithSeats(seats)
    const seatElements = document.querySelectorAll('.seat')
    expect(seatElements.length).toBe(10)
  })

  it('renders each seat number', () => {
    const seats = Array.from({ length: 5 }, (_, i) => makeSeat(i + 1))
    renderWithSeats(seats)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument()
    }
  })

  it('applies seat--available class to unreserved seats', () => {
    renderWithSeats([makeSeat(1)])
    const seat = document.querySelector('.seat')
    expect(seat).toHaveClass('seat--available')
  })

  it('applies seat--gold class to gold reserved seats', () => {
    renderWithSeats([makeSeat(1, 'Alice', 'gold')])
    const seat = document.querySelector('.seat')
    expect(seat).toHaveClass('seat--gold')
  })

  it('applies seat--silver class to silver reserved seats', () => {
    renderWithSeats([makeSeat(1, 'Alice', 'silver')])
    const seat = document.querySelector('.seat')
    expect(seat).toHaveClass('seat--silver')
  })

  it('shows available tooltip for unreserved seat', () => {
    renderWithSeats([makeSeat(1)])
    const seat = document.querySelector('.seat')
    expect(seat).toHaveAttribute('data-tooltip', 'Seat 1 — Available')
  })

  it('shows reserved tooltip with name and category for booked seat', () => {
    renderWithSeats([makeSeat(1, 'Alice', 'gold')])
    const seat = document.querySelector('.seat')
    expect(seat).toHaveAttribute('data-tooltip', 'Seat 1 — GOLD — Alice')
  })

  it('splits seats into rows based on VITE_REACT_SEATS_PER_ROW', () => {
    const seats = Array.from({ length: 20 }, (_, i) => makeSeat(i + 1))
    renderWithSeats(seats)
    const rows = document.querySelectorAll('.seatmap-row')
    expect(rows.length).toBe(2) // 20 seats / 10 per row = 2 rows
  })

  it('renders no seat rows when seatData is empty', () => {
    renderWithSeats([])
    const rows = document.querySelectorAll('.seatmap-row')
    expect(rows.length).toBe(0)
  })

  it('does not apply seat--gold class to an available seat', () => {
    renderWithSeats([makeSeat(1)])
    const seat = document.querySelector('.seat')
    expect(seat).not.toHaveClass('seat--gold')
    expect(seat).not.toHaveClass('seat--silver')
  })

  it('does not show reserved person name anywhere on screen', () => {
    renderWithSeats([makeSeat(1, 'Alice', 'gold')])
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('renders a mix of available and reserved seats correctly', () => {
    renderWithSeats([
      makeSeat(1, null,    null),
      makeSeat(2, 'Alice', 'gold'),
      makeSeat(3, 'Bob',   'silver'),
    ])
    const seats = document.querySelectorAll('.seat')
    expect(seats[0]).toHaveClass('seat--available')
    expect(seats[1]).toHaveClass('seat--gold')
    expect(seats[2]).toHaveClass('seat--silver')
  })
})
