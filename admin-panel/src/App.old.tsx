import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import {
  EventList,
  EventShow,
  EventEdit,
  EventCreate,
} from './components/Events';
import {
  ReservationList,
  ReservationShow,
  ReservationEdit,
} from './components/Reservations';
import { PaymentList, PaymentShow } from './components/Payments';
import { UserList, UserShow, UserEdit } from './components/Users';
import { Dashboard } from './components/Dashboard';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import { Calendar, Ticket, CreditCard, Users, BarChart3 } from 'lucide-react';

export default function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      title="Event Reservation Admin"
    >
      <Resource
        name="events"
        list={EventList}
        show={EventShow}
        edit={EventEdit}
        create={EventCreate}
        icon={Calendar}
      />
      <Resource
        name="reservations"
        list={ReservationList}
        show={ReservationShow}
        edit={ReservationEdit}
        icon={Ticket}
      />
      <Resource
        name="payments"
        list={PaymentList}
        show={PaymentShow}
        icon={CreditCard}
      />
      <Resource
        name="users"
        list={UserList}
        show={UserShow}
        edit={UserEdit}
        icon={Users}
      />
      <CustomRoutes>
        <Route path="/analytics" element={<div>Analytics Dashboard</div>} />
      </CustomRoutes>
    </Admin>
  );
}
