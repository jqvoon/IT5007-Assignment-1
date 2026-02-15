import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DeleteBooking from '../../components/DeleteBooking'

// ── Mock CSS ──────────────────────────────────────────────
vi.mock('../../components/DeleteBooking.css', () => ({}))

// ── Mock context with controllable fn ────────────────────
const mockUseAppContext = vi.fn()

vi.mock('../../context/appContext', () => ({
  useAppContext: () => mockUseAppContext(),
}))

// ── Helpers ───────────────────────────────────────────────
const mockSetReservationData = vi.fn()
const mockSetSeatData = vi.fn()

const makeReservation = (overrides = {}) => ({
  reservationId: 'RES-ABC123',
  fullName: 'Jane Smith',
  phoneNumber: '07700900000',
  seatNumber: 5,
  category: 'gold',
  reservationTimestamp: '2024-01-01T10:00:00.000Z',
  ...overrides,
})

const renderWithData = (reservations = []) => {
  mockUseAppContext.mockReturnValue({
    reservationData: reservations,
    setReservationData: mockSetReservationData,
    setSeatData: mockSetSeatData,
  })
  return render(<DeleteBooking />)
}

// Fill and submit the lookup form
const fillLookup = (reservationId = 'RES-ABC123', phoneNumber = '07700900000') => {
  const idInput    = screen.getByLabelText(/reservation id/i)
  const phoneInput = screen.getByLabelText(/phone number/i)

  if (reservationId) {
    fireEvent.change(idInput, { target: { value: reservationId } })
  }
  if (phoneNumber) {
    fireEvent.change(phoneInput, { target: { value: phoneNumber } })
  }

  fireEvent.click(screen.getByText(/look up booking/i))
}

// Click the confirm cancellation button specifically
const clickConfirm = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Confirm Cancellation' }))
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ════════════════════════════════════════════════════════
// DELETE BOOKING TESTS
// ════════════════════════════════════════════════════════
describe('DeleteBooking', () => {

  // ── Positive tests ──────────────────────────────────
  describe('positive', () => {

    it('renders the form title', () => {
      renderWithData()
      expect(screen.getByText('Cancel Booking')).toBeInTheDocument()
    })

    it('renders reservation ID and phone number inputs', () => {
      renderWithData()
      expect(screen.getByLabelText(/reservation id/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    })

    it('renders the Look Up Booking button', () => {
      renderWithData()
      expect(screen.getByText(/look up booking/i)).toBeInTheDocument()
    })

    it('shows booking details after a successful lookup', () => {
      renderWithData([makeReservation()])
      fillLookup()
      expect(screen.getByText('Booking found — please confirm cancellation:')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('RES-ABC123')).toBeInTheDocument()
    })

    it('shows seat number in confirm card after lookup', () => {
      renderWithData([makeReservation()])
      fillLookup()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('shows category in confirm card after lookup', () => {
      renderWithData([makeReservation()])
      fillLookup()
      expect(screen.getByText('Gold')).toBeInTheDocument()
    })

    it('shows Go Back and Confirm Cancellation buttons after lookup', () => {
      renderWithData([makeReservation()])
      fillLookup()
      expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Confirm Cancellation' })).toBeInTheDocument()
    })

    it('calls setReservationData on confirm cancellation', () => {
      renderWithData([makeReservation()])
      fillLookup()
      clickConfirm()
      expect(mockSetReservationData).toHaveBeenCalledTimes(1)
    })

    it('calls setSeatData on confirm cancellation', () => {
      renderWithData([makeReservation()])
      fillLookup()
      clickConfirm()
      expect(mockSetSeatData).toHaveBeenCalledTimes(1)
    })

    it('shows success message after cancellation', () => {
      renderWithData([makeReservation()])
      fillLookup()
      clickConfirm()
      expect(screen.getByText(/RES-ABC123 cancelled/i)).toBeInTheDocument()
    })

    it('returns to lookup form after cancellation', () => {
      renderWithData([makeReservation()])
      fillLookup()
      clickConfirm()
      expect(screen.getByLabelText(/reservation id/i)).toBeInTheDocument()
    })

    it('returns to lookup form and clears state when Go Back is clicked', () => {
      renderWithData([makeReservation()])
      fillLookup()
      fireEvent.click(screen.getByRole('button', { name: 'Go Back' }))
      expect(screen.getByLabelText(/reservation id/i)).toBeInTheDocument()
      expect(screen.queryByText(/booking found/i)).not.toBeInTheDocument()
    })

    it('lookup is case insensitive for reservation ID', () => {
      renderWithData([makeReservation()])
      fillLookup('res-abc123', '07700900000')
      expect(screen.getByText('Booking found — please confirm cancellation:')).toBeInTheDocument()
    })

  })

  // ── Negative tests ──────────────────────────────────
  describe('negative', () => {

    it('shows error when both fields are empty', () => {
      renderWithData([makeReservation()])
      fireEvent.click(screen.getByText(/look up booking/i))
      expect(screen.getByText(/please enter both/i)).toBeInTheDocument()
    })

    it('shows error when reservation ID is empty', () => {
      renderWithData([makeReservation()])
      const phoneInput = screen.getByLabelText(/phone number/i)
      fireEvent.change(phoneInput, { target: { value: '07700900000' } })
      fireEvent.click(screen.getByText(/look up booking/i))
      expect(screen.getByText(/please enter both/i)).toBeInTheDocument()
    })

    it('shows error when phone number is empty', () => {
      renderWithData([makeReservation()])
      const idInput = screen.getByLabelText(/reservation id/i)
      fireEvent.change(idInput, { target: { value: 'RES-ABC123' } })
      fireEvent.click(screen.getByText(/look up booking/i))
      expect(screen.getByText(/please enter both/i)).toBeInTheDocument()
    })

    it('shows error when reservation ID does not match', () => {
      renderWithData([makeReservation()])
      fillLookup('RES-WRONG1', '07700900000')
      expect(screen.getByText(/no reservation found/i)).toBeInTheDocument()
    })

    it('shows error when phone number does not match', () => {
      renderWithData([makeReservation()])
      fillLookup('RES-ABC123', '00000000000')
      expect(screen.getByText(/no reservation found/i)).toBeInTheDocument()
    })

    it('does not show confirm card when lookup fails', () => {
      renderWithData([makeReservation()])
      fillLookup('RES-WRONG1', '07700900000')
      expect(screen.queryByText(/booking found/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Confirm Cancellation' })).not.toBeInTheDocument()
    })

    it('does not call setReservationData when lookup fails', () => {
      renderWithData([makeReservation()])
      fillLookup('RES-WRONG1', '07700900000')
      expect(mockSetReservationData).not.toHaveBeenCalled()
    })

    it('does not call setSeatData when lookup fails', () => {
      renderWithData([makeReservation()])
      fillLookup('RES-WRONG1', '07700900000')
      expect(mockSetSeatData).not.toHaveBeenCalled()
    })

    it('clears error when user starts typing after failed lookup', () => {
      renderWithData([makeReservation()])
      fillLookup('RES-WRONG1', '07700900000')
      expect(screen.getByText(/no reservation found/i)).toBeInTheDocument()

      fireEvent.change(screen.getByLabelText(/reservation id/i), {
        target: { value: 'R' }
      })
      expect(screen.queryByText(/no reservation found/i)).not.toBeInTheDocument()
    })

    it('shows error when reservationData is empty', () => {
      renderWithData([])
      fillLookup('RES-ABC123', '07700900000')
      expect(screen.getByText(/no reservation found/i)).toBeInTheDocument()
    })

  })
})
