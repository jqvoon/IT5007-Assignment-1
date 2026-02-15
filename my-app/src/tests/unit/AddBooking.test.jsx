import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AddBooking from '../../components/AddBooking'

// ── Mock CSS ──────────────────────────────────────────────
vi.mock('../../components/AddBooking.css', () => ({}))

// ── Mock context with controllable fn ────────────────────
const mockUseAppContext = vi.fn()

vi.mock('../../context/appContext', () => ({
  useAppContext: () => mockUseAppContext(),
  reservationTemplate: {
    reservationId: '',
    fullName: '',
    phoneNumber: '',
    seatNumber: '',
    category: '',
    reservationTimestamp: '',
  }
}))

// ── Helpers ───────────────────────────────────────────────
const makeSeat = (seatNumber, reservedBy = null, category = null) => ({
  seatNumber,
  reservedBy,
  category,
})

const mockSetSeatData = vi.fn()
const mockSetReservationData = vi.fn()

const renderWithSeats = (seats) => {
  mockUseAppContext.mockReturnValue({
    seatData: seats,
    setSeatData: mockSetSeatData,
    setReservationData: mockSetReservationData,
  })
  return render(<AddBooking />)
}

// fill and submit the form
const fillAndSubmit = (name = 'Jane Smith', phone = '07700900000', category = 'gold') => {
  if (name)     fireEvent.change(screen.getByLabelText(/full name/i),    { target: { value: name,     name: 'fullName'     } })
  if (phone)    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: phone,    name: 'phoneNumber'  } })
  if (category) fireEvent.click(screen.getByText(category.charAt(0).toUpperCase() + category.slice(1)))
    fireEvent.click(document.querySelector('.bookseat-submit'))
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ════════════════════════════════════════════════════════
// ADD BOOKING TESTS
// ════════════════════════════════════════════════════════
describe('AddBooking', () => {

  // ── Positive tests ──────────────────────────────────
  describe('positive', () => {

    it('renders the form title', () => {
      renderWithSeats([makeSeat(1), makeSeat(2)])
      expect(screen.getByText('Book a Seat')).toBeInTheDocument()
    })

    it('renders full name, phone number inputs and category options', () => {
      renderWithSeats([makeSeat(1)])
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
      expect(screen.getByText('Gold')).toBeInTheDocument()
      expect(screen.getByText('Silver')).toBeInTheDocument()
    })

    it('shows correct available seat count', () => {
      renderWithSeats([makeSeat(1), makeSeat(2), makeSeat(3, 'Alice', 'gold')])
      expect(screen.getByText(/2 seats remaining/i)).toBeInTheDocument()
    })

    it('shows success message after valid submission', () => {
      renderWithSeats([makeSeat(1), makeSeat(2)])
      fillAndSubmit()
      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument()
    })

    it('shows reservation ID in success message', () => {
      renderWithSeats([makeSeat(1)])
      fillAndSubmit()
      expect(screen.getByText(/RES-/i)).toBeInTheDocument()
    })

    it('calls setSeatData on successful booking', () => {
      renderWithSeats([makeSeat(1), makeSeat(2)])
      fillAndSubmit()
      expect(mockSetSeatData).toHaveBeenCalledTimes(1)
    })

    it('calls setReservationData on successful booking', () => {
      renderWithSeats([makeSeat(1), makeSeat(2)])
      fillAndSubmit()
      expect(mockSetReservationData).toHaveBeenCalledTimes(1)
    })

    it('resets form fields after successful booking', () => {
      renderWithSeats([makeSeat(1), makeSeat(2)])
      fillAndSubmit()
      expect(screen.getByLabelText(/full name/i).value).toBe('')
      expect(screen.getByLabelText(/phone number/i).value).toBe('')
    })

    it('shows "1 seat remaining" with singular when only 1 seat left', () => {
      renderWithSeats([makeSeat(1)])
      expect(screen.getByText(/1 seat remaining/i)).toBeInTheDocument()
    })

  })

  // ── Negative tests ──────────────────────────────────
  describe('negative', () => {

    it('shows error when full name is empty', () => {
      renderWithSeats([makeSeat(1)])
      fillAndSubmit('', '07700900000', 'gold')
      expect(screen.getByText(/please enter a full name/i)).toBeInTheDocument()
    })

    it('shows error when phone number is empty', () => {
      renderWithSeats([makeSeat(1)])
      fillAndSubmit('Jane Smith', '', 'gold')
      expect(screen.getByText(/please enter a phone number/i)).toBeInTheDocument()
    })

    it('shows error when no category is selected', () => {
      renderWithSeats([makeSeat(1)])
      fillAndSubmit('Jane Smith', '07700900000', null)
      expect(screen.getByText(/please select a ticket category/i)).toBeInTheDocument()
    })

    it('shows error when no seats are available', () => {
       renderWithSeats([makeSeat(1, 'Alice', 'gold')])
        
       // button is disabled so we can't click it — check the sold out state instead
       expect(screen.getByText(/sold out/i)).toBeInTheDocument()
       expect(document.querySelector('.bookseat-submit')).toBeDisabled()
    })

    it('does not call setSeatData when validation fails', () => {
      renderWithSeats([makeSeat(1)])
      fillAndSubmit('', '', null)
      expect(mockSetSeatData).not.toHaveBeenCalled()
    })

    it('does not call setReservationData when validation fails', () => {
      renderWithSeats([makeSeat(1)])
      fillAndSubmit('', '', null)
      expect(mockSetReservationData).not.toHaveBeenCalled()
    })

    it('clears error message when user starts typing after an error', () => {
      renderWithSeats([makeSeat(1)])
      fillAndSubmit('', '07700900000', 'gold')
      expect(screen.getByText(/please enter a full name/i)).toBeInTheDocument()

      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: 'J', name: 'fullName' }
      })
      expect(screen.queryByText(/please enter a full name/i)).not.toBeInTheDocument()
    })

  })
})
