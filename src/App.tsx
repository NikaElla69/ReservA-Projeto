import React, { useState } from 'react';
import { RestaurantSelection } from './components/RestaurantSelection';
import { TableSelection } from './components/TableSelection';
import { LoginPage } from './components/LoginPage';
import { ReservationConfirm } from './components/ReservationConfirm';
import { ReservationCancel } from './components/ReservationCancel';
import { ReservationSuccess } from './components/ReservationSuccess';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  image: string;
  rating: number;
  priceRange: string;
  location: string;
  openHours: string;
  phone: string;
  features: string[];
  operatingDays: number[]; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  closedDates?: string[]; // Datas específicas fechadas (formato YYYY-MM-DD)
};

export type Table = {
  id: string;
  number: number;
  seats: number;
  available: boolean;
  position: { x: number; y: number };
};

export type Reservation = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  tableId: string;
  tableNumber: number;
  seats: number;
  date: string;
  time: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentAmount: number;
  createdAt: Date;
};

export type Screen = 'restaurants' | 'tables' | 'login' | 'confirm' | 'cancel' | 'success';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('restaurants');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentScreen('tables');
  };

  const handleTableSelect = (reservation: Reservation) => {
    setCurrentReservation(reservation);
    setCurrentScreen('login');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentScreen('confirm');
  };

  const handleReservationConfirm = () => {
    setCurrentScreen('success');
  };

  const handleReservationCancel = () => {
    setCurrentScreen('cancel');
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setCurrentReservation(null);
    setUser(null);
    setCurrentScreen('restaurants');
  };

  const handleBackToTables = () => {
    setCurrentReservation(null);
    setUser(null);
    setCurrentScreen('tables');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === 'restaurants' && (
        <RestaurantSelection onRestaurantSelect={handleRestaurantSelect} />
      )}
      
      {currentScreen === 'tables' && selectedRestaurant && (
        <TableSelection 
          restaurant={selectedRestaurant}
          onTableSelect={handleTableSelect}
          onBack={handleBackToRestaurants}
        />
      )}

      {currentScreen === 'login' && currentReservation && (
        <LoginPage 
          onLogin={handleLogin} 
          onBack={handleBackToTables}
          reservation={currentReservation}
        />
      )}
      
      {currentScreen === 'confirm' && currentReservation && user && selectedRestaurant && (
        <ReservationConfirm
          reservation={currentReservation}
          user={user}
          restaurant={selectedRestaurant}
          onConfirm={handleReservationConfirm}
          onCancel={handleReservationCancel}
          onBack={handleBackToLogin}
        />
      )}
      
      {currentScreen === 'cancel' && currentReservation && (
        <ReservationCancel
          reservation={currentReservation}
          onBack={handleBackToRestaurants}
        />
      )}
      
      {currentScreen === 'success' && currentReservation && selectedRestaurant && (
        <ReservationSuccess
          reservation={currentReservation}
          restaurant={selectedRestaurant}
          onBack={handleBackToRestaurants}
        />
      )}
    </div>
  );
}