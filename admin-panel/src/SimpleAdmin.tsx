import { useState, useEffect } from 'react';

export default function SimpleAdmin() {
  const [events, setEvents] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, reservationsRes, usersRes] = await Promise.all([
        fetch('http://localhost:3010/api/events'),
        fetch('http://localhost:3010/api/reservations'),
        fetch('http://localhost:3010/api/users'),
      ]);

      setEvents(await eventsRes.json());
      setReservations(await reservationsRes.json());
      setUsers(await usersRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await fetch(`http://localhost:3010/api/events/${id}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      await fetch(`http://localhost:3010/api/reservations/${id}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    },
    header: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
    },
    tabs: {
      display: 'flex',
      borderBottom: '2px solid #e5e7eb',
      marginBottom: '20px',
    },
    tab: {
      padding: '12px 24px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      borderBottom: '2px solid transparent',
      fontWeight: '500',
    },
    activeTab: {
      borderBottomColor: '#2563eb',
      color: '#2563eb',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    th: {
      backgroundColor: '#f3f4f6',
      padding: '12px',
      textAlign: 'left' as const,
      fontWeight: '600',
      borderBottom: '1px solid #e5e7eb',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e5e7eb',
    },
    button: {
      padding: '6px 12px',
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
    },
    published: {
      backgroundColor: '#dcfce7',
      color: '#166534',
    },
    confirmed: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ margin: 0 }}>Event Reservation Admin Panel</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          Manage your events, reservations, and users
        </p>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'events' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('events')}
        >
          Events ({events.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'reservations' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('reservations')}
        >
          Reservations ({reservations.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'users' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
      </div>

      {activeTab === 'events' && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Available Seats</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event: any) => (
              <tr key={event.id}>
                <td style={styles.td}>{event.title}</td>
                <td style={styles.td}>
                  {event.date} at {event.time}
                </td>
                <td style={styles.td}>{event.location}</td>
                <td style={styles.td}>${event.price}</td>
                <td style={styles.td}>
                  {event.availableSeats} / {event.totalSeats}
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...styles.published }}>
                    {event.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => deleteEvent(event.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'reservations' && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Event</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation: any) => (
              <tr key={reservation.id}>
                <td style={styles.td}>{reservation.id.slice(0, 8)}...</td>
                <td style={styles.td}>{reservation.eventTitle || 'N/A'}</td>
                <td style={styles.td}>{reservation.userEmail || 'N/A'}</td>
                <td style={styles.td}>{reservation.quantity || 1}</td>
                <td style={styles.td}>${reservation.total || 'N/A'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...styles.confirmed }}>
                    {reservation.status}
                  </span>
                </td>
                <td style={styles.td}>
                  {new Date(reservation.createdAt).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => deleteReservation(reservation.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'users' && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center', color: '#6b7280' }}>
        <p>Last updated: {new Date().toLocaleString()}</p>
        <button
          style={{ ...styles.button, backgroundColor: '#059669' }}
          onClick={fetchData}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}
