import React from 'react';
import { Admin, Resource } from 'react-admin';
import { EventList, EventShow, EventEdit, EventCreate } from './components/Events';
import { ReservationList, ReservationShow, ReservationEdit } from './components/Reservations';
import { PaymentList, PaymentShow } from './components/Payments';
import { UserList, UserShow, UserEdit } from './components/Users';

const App = () => (
  <div>
    <h1>Admin Panel</h1>
    <p>React Admin panel for Event Reservation System</p>
  </div>
);

export default App;
