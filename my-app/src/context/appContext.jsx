import { createContext, useContext, useState } from 'react';

const totalSeats = parseInt(import.meta.env.VITE_REACT_MAX_SEATS) || 10;
  
export const reservationTemplate = {
    reservationId: "",
    fullName: "",
    phoneNumber: "",
    seats: []
}
export const reservedSeatTemplate = {
    seatNumber: "",
    category: "",
    reservationTimestamp: ""
}

const AppContext = createContext();
export function AppProvider({ children }) {  
  const [reservationData , setReservationData] = useState([])
  const [seatData , setSeatData] = useState(
    Array.from({ length: totalSeats }, (_, i) => ({
        seatNumber: i + 1,
        category: null,
        reservedBy: null,
    }))
  )

  return (
    <AppContext.Provider value={{ 
      seatData, setSeatData, 
      reservationData, setReservationData 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
