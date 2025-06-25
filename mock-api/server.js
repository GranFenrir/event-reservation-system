const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3010;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let events = [
  {
    id: '1',
    title: 'Summer Music Festival 2025',
    description:
      'An amazing outdoor music festival featuring top artists from around the world.',
    date: '2025-07-15',
    time: '18:00',
    location: 'Central Park Amphitheater',
    price: 89.99,
    totalSeats: 5000,
    availableSeats: 4250,
    category: 'Music',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500',
  },
  {
    id: '2',
    title: 'Tech Innovation Conference',
    description:
      'Join industry leaders for a day of insights into the future of technology.',
    date: '2025-08-22',
    time: '09:00',
    location: 'Convention Center Hall A',
    price: 149.99,
    totalSeats: 800,
    availableSeats: 423,
    category: 'Conference',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
  },
  {
    id: '3',
    title: 'Comedy Night Live',
    description:
      'Laugh out loud with our featured comedians in an intimate setting.',
    date: '2025-07-08',
    time: '20:00',
    location: 'Downtown Comedy Club',
    price: 35.0,
    totalSeats: 200,
    availableSeats: 87,
    category: 'Comedy',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1558618043-97dcb4851c8c?w=500',
  },
];

let users = [];
let reservations = [];
let payments = [];

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = {
    id: uuidv4(),
    name,
    email,
    password, // In real app, this would be hashed
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  const token = 'mock-jwt-token-' + user.id;
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = 'mock-jwt-token-' + user.id;
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// Events endpoints
app.get('/api/events', (req, res) => {
  res.json(events);
});

app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
});

app.post('/api/events', (req, res) => {
  const event = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  events.push(event);
  res.status(201).json(event);
});

app.put('/api/events/:id', (req, res) => {
  const index = events.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }

  events[index] = { ...events[index], ...req.body };
  res.json(events[index]);
});

app.delete('/api/events/:id', (req, res) => {
  const index = events.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }

  events.splice(index, 1);
  res.status(204).send();
});

// Reservations endpoints
app.get('/api/reservations', (req, res) => {
  res.json(reservations);
});

app.post('/api/reservations', (req, res) => {
  const reservation = {
    id: uuidv4(),
    ...req.body,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  reservations.push(reservation);

  // Update event available seats
  const event = events.find(e => e.id === req.body.eventId);
  if (event) {
    event.availableSeats -= req.body.quantity || 1;
  }

  res.status(201).json(reservation);
});

app.delete('/api/reservations/:id', (req, res) => {
  const index = reservations.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  const reservation = reservations[index];

  // Update event available seats
  const event = events.find(e => e.id === reservation.eventId);
  if (event) {
    event.availableSeats += reservation.quantity || 1;
  }

  reservations.splice(index, 1);
  res.status(204).send();
});

// Payments endpoints
app.get('/api/payments', (req, res) => {
  res.json(payments);
});

app.post('/api/payments', (req, res) => {
  const payment = {
    id: uuidv4(),
    ...req.body,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };
  payments.push(payment);
  res.status(201).json(payment);
});

// Users endpoints (for admin)
app.get('/api/users', (req, res) => {
  res.json(
    users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
    }))
  );
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/events');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/reservations');
  console.log('  GET  /health');
});
