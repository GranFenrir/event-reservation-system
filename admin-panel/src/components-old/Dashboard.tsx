import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useGetList } from 'react-admin';
import {
  Calendar,
  Ticket,
  CreditCard,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

export const Dashboard = () => {
  const { data: events } = useGetList('events', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'id', order: 'ASC' },
  });

  const { data: reservations } = useGetList('reservations', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'id', order: 'ASC' },
  });

  const { data: payments } = useGetList('payments', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'id', order: 'ASC' },
  });

  const { data: users } = useGetList('users', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'id', order: 'ASC' },
  });

  const totalRevenue =
    payments?.reduce(
      (sum, payment) =>
        payment.status === 'completed' ? sum + payment.amount : sum,
      0
    ) || 0;

  const activeEvents = events?.filter(event => event.isActive).length || 0;
  const confirmedReservations =
    reservations?.filter(res => res.status === 'confirmed').length || 0;
  const totalUsers = users?.length || 0;

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <Card sx={{ height: '100%', minHeight: 120 }}>
      <CardHeader
        avatar={<Icon size={24} style={{ color }} />}
        title={
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        }
        action={
          trend && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: trend > 0 ? 'green' : 'red',
              }}
            >
              {trend > 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {Math.abs(trend)}%
              </Typography>
            </div>
          )
        }
      />
      <CardContent>
        <Typography variant="h4" component="div" style={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <StatCard
          title="Active Events"
          value={activeEvents}
          icon={Calendar}
          color="#1976d2"
          trend={12}
        />
        <StatCard
          title="Total Reservations"
          value={confirmedReservations}
          icon={Ticket}
          color="#388e3c"
          trend={8}
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={CreditCard}
          color="#f57c00"
          trend={15}
        />
        <StatCard
          title="Registered Users"
          value={totalUsers}
          icon={Users}
          color="#7b1fa2"
          trend={5}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
        }}
      >
        <Card>
          <CardHeader title="Recent Events" />
          <CardContent>
            {events?.slice(0, 5).map((event: any) => (
              <div
                key={event.id}
                style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
              >
                <Typography variant="subtitle1">{event.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(event.startDate).toLocaleDateString()} -{' '}
                  {event.category}
                </Typography>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Recent Reservations" />
          <CardContent>
            {reservations?.slice(0, 5).map((reservation: any) => (
              <div
                key={reservation.id}
                style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
              >
                <Typography variant="subtitle1">
                  Reservation #{reservation.id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ${reservation.totalAmount} - {reservation.status}
                </Typography>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
