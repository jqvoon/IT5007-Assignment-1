import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AppProvider } from '../../context/appContext'
import AvailableTickets from '../../components/AvailableTickets'
import AddBooking from '../../components/AddBooking'
import DeleteBooking from '../../components/DeleteBooking'
import DisplayAttendee from '../../components/DisplayAttendee'
import SeatMap from '../../components/SeatMap'

// ── Render all components under one real shared Provider ──
const renderApp = () => {
  return render(
    <AppProvider>
      <AvailableTickets />
      <SeatMap />
      <AddBooking />
      <DisplayAttendee />
      <DeleteBooking />
    </AppProvider>
  )
}

// ── Helpers ───────────────────────────────────────────────

const getAvailableCount = () => {
  const el = document.querySelector('.tickets-remaining')
  return parseInt(el.textContent)
}

// scope everything inside .bookseat-card to avoid ambiguous matches
const bookSeat = (name = 'Jane Smith', phone = '07700900000', category = 'gold') => {
  const card = document.querySelector('.bookseat-card')
  fireEvent.change(card.querySelector('#fullName'),    { target: { value: name  } })
  fireEvent.change(card.querySelector('#phoneNumber'), { target: { value: phone } })
  // click the radio input directly by value — avoids matching legend/table text
  fireEvent.click(card.querySelector(`input[type="radio"][value="${category}"]`))
  fireEvent.click(card.querySelector('.bookseat-submit'))
}

// extract reservation ID from the success message span
const getReservationId = () => {
  const el = document.querySelector('.status-id')
  return el.textContent.match(/RES-[A-Z0-9]+/)[0]
}

// scope all inputs inside .delete-card using name attribute to avoid id conflicts
const lookupAndDelete = (reservationId, phone = '07700900000') => {
  const card = document.querySelector('.delete-card')
  fireEvent.change(card.querySelector('input[name="reservationId"]'), { target: { value: reservationId } })
  fireEvent.change(card.querySelector('input[name="phoneNumber"]'),   { target: { value: phone } })
  fireEvent.click(card.querySelector('.delete-lookup-btn'))
  fireEvent.click(screen.getByRole('button', { name: 'Confirm Cancellation' }))
}

const TOTAL_SEATS = parseInt(import.meta.env.VITE_REACT_MAX_SEATS) || 10

// ════════════════════════════════════════════════════════
// INTEGRATION TESTS — Full Business Flow
// ════════════════════════════════════════════════════════
describe('Full booking lifecycle', () => {

  // ── Step 1: Initial state ────────────────────────────
  describe('Step 1 — initial state', () => {

    it('shows all seats as available on load', () => {
      renderApp()
      expect(getAvailableCount()).toBe(TOTAL_SEATS)
    })

    it('shows no attendees in the table on load', () => {
      renderApp()
      expect(screen.getByText(/no reservations yet/i)).toBeInTheDocument()
    })

    it('all seats are green (available) on the seat map', () => {
      renderApp()
      expect(document.querySelectorAll('.seat--available').length).toBe(TOTAL_SEATS)
    })

  })

  // ── Step 2: Book a seat ──────────────────────────────
  describe('Step 2 — book a seat', () => {

    it('available ticket count decreases by 1 after booking', () => {
      renderApp()
      const before = getAvailableCount()
      bookSeat()
      expect(getAvailableCount()).toBe(before - 1)
    })

    it('booked attendee appears in the attendees table', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('correct category shows in attendees table', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      const table = document.querySelector('.attendees-table')
      expect(table.textContent).toContain('Gold')
    })

    it('one seat changes from available to gold on seat map after booking', () => {
      renderApp()
      const availableBefore = document.querySelectorAll('.seat--available').length
      bookSeat('Jane Smith', '07700900000', 'gold')
      expect(document.querySelectorAll('.seat--available').length).toBe(availableBefore - 1)
      expect(document.querySelectorAll('.seat--gold').length).toBe(1)
    })

    it('success message shows reservation ID after booking', () => {
      renderApp()
      bookSeat()
      expect(document.querySelector('.status-id').textContent).toMatch(/RES-[A-Z0-9]+/)
    })

    it('form resets after successful booking', () => {
      renderApp()
      bookSeat()
      expect(document.querySelector('#fullName').value).toBe('')
      expect(document.querySelector('.bookseat-card #phoneNumber').value).toBe('')
    })

  })

  // ── Step 3: Book multiple seats ──────────────────────
  describe('Step 3 — multiple bookings', () => {

    it('two bookings reduce available count by 2', () => {
      renderApp()
      const before = getAvailableCount()
      bookSeat('Jane Smith', '07700900000', 'gold')
      bookSeat('John Doe',   '07700900001', 'silver')
      expect(getAvailableCount()).toBe(before - 2)
    })

    it('both attendees appear in the table after two bookings', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      bookSeat('John Doe',   '07700900001', 'silver')
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('seat map shows both gold and silver seats after two bookings', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      bookSeat('John Doe',   '07700900001', 'silver')
      expect(document.querySelectorAll('.seat--gold').length).toBe(1)
      expect(document.querySelectorAll('.seat--silver').length).toBe(1)
    })

  })

  // ── Step 4: Delete a booking ─────────────────────────
  describe('Step 4 — delete a booking', () => {

    it('available count goes back up by 1 after cancellation', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      const afterBooking = getAvailableCount()
      const reservationId = getReservationId()
      lookupAndDelete(reservationId, '07700900000')
      expect(getAvailableCount()).toBe(afterBooking + 1)
    })

    it('attendee is removed from table after cancellation', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      const reservationId = getReservationId()
      lookupAndDelete(reservationId, '07700900000')
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })

    it('seat returns to available (green) on seat map after cancellation', () => {
      renderApp()
      const availableBefore = document.querySelectorAll('.seat--available').length
      bookSeat('Jane Smith', '07700900000', 'gold')
      expect(document.querySelectorAll('.seat--gold').length).toBe(1)
      const reservationId = getReservationId()
      lookupAndDelete(reservationId, '07700900000')
      expect(document.querySelectorAll('.seat--gold').length).toBe(0)
      expect(document.querySelectorAll('.seat--available').length).toBe(availableBefore)
    })

    it('success message shows after cancellation', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      const reservationId = getReservationId()
      lookupAndDelete(reservationId, '07700900000')
      expect(screen.getByText(/cancelled/i)).toBeInTheDocument()
    })

    it('cancelling one booking does not affect other bookings', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      const reservationId = getReservationId()
      bookSeat('John Doe',   '07700900001', 'silver')
      lookupAndDelete(reservationId, '07700900000')
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

  })

  // ── Step 5: Full cycle back to initial state ─────────
  describe('Step 5 — full cycle restores initial state', () => {

    it('available count returns to original after booking and cancelling', () => {
      renderApp()
      const initial = getAvailableCount()
      bookSeat('Jane Smith', '07700900000', 'gold')
      const reservationId = getReservationId()
      lookupAndDelete(reservationId, '07700900000')
      expect(getAvailableCount()).toBe(initial)
    })

    it('attendees table is empty after booking and cancelling the only booking', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      const reservationId = getReservationId()
      lookupAndDelete(reservationId, '07700900000')
      expect(screen.getByText(/no reservations yet/i)).toBeInTheDocument()
    })

    it('all seats are available on seat map after booking and cancelling', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      const reservationId = getReservationId()
      lookupAndDelete(reservationId, '07700900000')
      expect(document.querySelectorAll('.seat--available').length).toBe(TOTAL_SEATS)
    })

  })

  // ── Step 6: AddBooking validation ────────────────────
  describe('Step 6 — add booking validation', () => {

    it('shows error and does not book when full name is missing', () => {
      renderApp()
      const before = getAvailableCount()
      const card = document.querySelector('.bookseat-card')
      // leave fullName empty, fill rest
      fireEvent.change(card.querySelector('#phoneNumber'), { target: { value: '07700900000' } })
      fireEvent.click(card.querySelector('input[type="radio"][value="gold"]'))
      fireEvent.click(card.querySelector('.bookseat-submit'))
      expect(screen.getByText(/please enter a full name/i)).toBeInTheDocument()
      // seat count must not change
      expect(getAvailableCount()).toBe(before)
      // attendees table still empty
      expect(screen.getByText(/no reservations yet/i)).toBeInTheDocument()
    })

    it('shows error and does not book when phone number is missing', () => {
      renderApp()
      const before = getAvailableCount()
      const card = document.querySelector('.bookseat-card')
      fireEvent.change(card.querySelector('#fullName'), { target: { value: 'Jane Smith' } })
      // leave phoneNumber empty
      fireEvent.click(card.querySelector('input[type="radio"][value="gold"]'))
      fireEvent.click(card.querySelector('.bookseat-submit'))
      expect(screen.getByText(/please enter a phone number/i)).toBeInTheDocument()
      expect(getAvailableCount()).toBe(before)
      expect(screen.getByText(/no reservations yet/i)).toBeInTheDocument()
    })

    it('shows error and does not book when category is not selected', () => {
      renderApp()
      const before = getAvailableCount()
      const card = document.querySelector('.bookseat-card')
      fireEvent.change(card.querySelector('#fullName'),    { target: { value: 'Jane Smith'   } })
      fireEvent.change(card.querySelector('#phoneNumber'), { target: { value: '07700900000' } })
      // do not select a category
      fireEvent.click(card.querySelector('.bookseat-submit'))
      expect(screen.getByText(/please select a ticket category/i)).toBeInTheDocument()
      expect(getAvailableCount()).toBe(before)
      expect(screen.getByText(/no reservations yet/i)).toBeInTheDocument()
    })

    it('button is disabled and shows Sold Out when no seats remain', () => {
      renderApp()
      // fill all seats
      const total = getAvailableCount()
      for (let i = 0; i < total; i++) {
        bookSeat(`Person ${i}`, `0770090000${i}`, 'gold')
      }
      expect(getAvailableCount()).toBe(0)
      const submitBtn = document.querySelector('.bookseat-submit')
      expect(submitBtn).toBeDisabled()
      expect(submitBtn.textContent).toMatch(/sold out/i)
    })

  })

  // ── Step 7: DeleteBooking validation ─────────────────
  describe('Step 7 — delete booking validation', () => {

    it('shows error when both reservation ID and phone number are missing', () => {
      renderApp()
      const card = document.querySelector('.delete-card')
      // submit with both fields empty
      fireEvent.click(card.querySelector('.delete-lookup-btn'))
      expect(screen.getByText(/please enter both/i)).toBeInTheDocument()
    })

    it('shows error when reservation ID is missing but phone is provided', () => {
      renderApp()
      const card = document.querySelector('.delete-card')
      fireEvent.change(card.querySelector('input[name="phoneNumber"]'), { target: { value: '07700900000' } })
      fireEvent.click(card.querySelector('.delete-lookup-btn'))
      expect(screen.getByText(/please enter both/i)).toBeInTheDocument()
    })

    it('shows error when phone is missing but reservation ID is provided', () => {
      renderApp()
      const card = document.querySelector('.delete-card')
      fireEvent.change(card.querySelector('input[name="reservationId"]'), { target: { value: 'RES-ABC123' } })
      fireEvent.click(card.querySelector('.delete-lookup-btn'))
      expect(screen.getByText(/please enter both/i)).toBeInTheDocument()
    })

    it('shows error when reservation ID does not match any booking', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      const card = document.querySelector('.delete-card')
      fireEvent.change(card.querySelector('input[name="reservationId"]'), { target: { value: 'RES-WRONG1' } })
      fireEvent.change(card.querySelector('input[name="phoneNumber"]'),   { target: { value: '07700900000' } })
      fireEvent.click(card.querySelector('.delete-lookup-btn'))
      expect(screen.getByText(/no reservation found/i)).toBeInTheDocument()
      // booking should still exist in the table
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('shows error when phone number does not match the reservation', () => {
      renderApp()
      bookSeat('Jane Smith', '07700900000', 'gold')
      const reservationId = getReservationId()
      const card = document.querySelector('.delete-card')
      fireEvent.change(card.querySelector('input[name="reservationId"]'), { target: { value: reservationId } })
      fireEvent.change(card.querySelector('input[name="phoneNumber"]'),   { target: { value: '00000000000' } })
      fireEvent.click(card.querySelector('.delete-lookup-btn'))
      expect(screen.getByText(/no reservation found/i)).toBeInTheDocument()
      // booking should still exist
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(getAvailableCount()).toBe(TOTAL_SEATS - 1)
    })

    it('does not show confirm card when lookup fails', () => {
      renderApp()
      const card = document.querySelector('.delete-card')
      fireEvent.change(card.querySelector('input[name="reservationId"]'), { target: { value: 'RES-WRONG1' } })
      fireEvent.change(card.querySelector('input[name="phoneNumber"]'),   { target: { value: '07700900000' } })
      fireEvent.click(card.querySelector('.delete-lookup-btn'))
      expect(screen.queryByText(/booking found/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Confirm Cancellation' })).not.toBeInTheDocument()
    })

  })
})
