const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { knex, initDb } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'event_nexus_secret_key_123';

// Auth Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [id] = await knex('users').insert({ name, email, password: hashedPassword, role });
    res.json({ id, message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Email already exists' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await knex('users').where({ email }).first();
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Event Routes
app.get('/api/events', async (req, res) => {
  const query = knex('events')
    .join('users', 'events.organizer_id', 'users.id')
    .select('events.*', 'users.name as organizer_name');
  
  if (req.query.status) query.where('events.status', req.query.status);
  else query.where('events.status', 'approved');
  
  if (req.query.category) query.where('events.category', req.query.category);
  if (req.query.search) query.where('events.name', 'like', `%${req.query.search}%`);
  
  const events = await query;
  res.json(events);
});

app.get('/api/events/:id', async (req, res) => {
  const event = await knex('events')
    .join('users', 'events.organizer_id', 'users.id')
    .where('events.id', req.params.id)
    .select('events.*', 'users.name as organizer_name')
    .first();
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

app.post('/api/events', authenticate, async (req, res) => {
  const { name, category, date, time, location, description, price, total_seats, image_url } = req.body;
  const [id] = await knex('events').insert({
    name, category, date, time, location, description, price, total_seats,
    available_seats: total_seats, image_url, organizer_id: req.user.id,
    status: req.user.role === 'admin' ? 'approved' : 'pending'
  });
  res.json({ id, message: 'Event submitted for approval' });
});

// Organizer Routes
app.get('/api/organizer/events', authenticate, async (req, res) => {
  if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Organizer access required' });
  }
  const events = await knex('events').where({ organizer_id: req.user.id });
  res.json(events);
});

// Booking Routes
app.post('/api/bookings', authenticate, async (req, res) => {
  const { event_id, quantity } = req.body;
  const event = await knex('events').where({ id: event_id }).first();
  if (!event || event.available_seats < quantity) return res.status(400).json({ message: 'Not enough seats' });
  
  const [id] = await knex('bookings').insert({
    user_id: req.user.id, event_id, quantity,
    total_price: event.price * quantity,
    status: 'pending_payment'
  });
  
  res.json({ id, message: 'Booking created, proceed to payment' });
});

app.post('/api/payments', authenticate, async (req, res) => {
  const { booking_id, payment_method, transaction_id, amount } = req.body;
  
  await knex.transaction(async trx => {
    await trx('payments').insert({
      booking_id, user_id: req.user.id, amount, payment_method, transaction_id, status: 'completed'
    });
    
    await trx('bookings').where({ id: booking_id }).update({
      status: 'pending_approval', transaction_id
    });

    const booking = await trx('bookings').where({ id: booking_id }).first();
    await trx('events').where({ id: booking.event_id }).decrement('available_seats', booking.quantity);
  });
  
  res.json({ message: 'Payment successful, waiting for admin approval' });
});

app.get('/api/my-bookings', authenticate, async (req, res) => {
  const bookings = await knex('bookings')
    .join('events', 'bookings.event_id', 'events.id')
    .where('bookings.user_id', req.user.id)
    .select('bookings.*', 'events.name as event_name', 'events.date', 'events.location', 'events.image_url');
  res.json(bookings);
});

// Admin Routes
app.get('/api/admin/stats', authenticate, isAdmin, async (req, res) => {
  const totalEvents = await knex('events').count('id as count').first();
  const pendingEvents = await knex('events').where({ status: 'pending' }).count('id as count').first();
  const totalBookings = await knex('bookings').count('id as count').first();
  const pendingBookings = await knex('bookings').where({ status: 'pending_approval' }).count('id as count').first();
  const totalRevenue = await knex('bookings').where({ status: 'approved' }).sum('total_price as sum').first();
  
  res.json({
    totalEvents: totalEvents.count,
    pendingEvents: pendingEvents.count,
    totalBookings: totalBookings.count,
    pendingBookings: pendingBookings.count,
    totalRevenue: totalRevenue.sum || 0
  });
});

app.get('/api/admin/pending-events', authenticate, isAdmin, async (req, res) => {
  const events = await knex('events')
    .join('users', 'events.organizer_id', 'users.id')
    .where('events.status', 'pending')
    .select('events.*', 'users.name as organizer_name');
  res.json(events);
});

app.post('/api/admin/approve-event', authenticate, isAdmin, async (req, res) => {
  const { id, status } = req.body;
  await knex('events').where({ id }).update({ status });
  res.json({ message: `Event ${status}` });
});

app.get('/api/admin/pending-bookings', authenticate, isAdmin, async (req, res) => {
  const bookings = await knex('bookings')
    .join('events', 'bookings.event_id', 'events.id')
    .join('users', 'bookings.user_id', 'users.id')
    .where('bookings.status', 'pending_approval')
    .select('bookings.*', 'events.name as event_name', 'users.name as user_name');
  res.json(bookings);
});

app.post('/api/admin/approve-booking', authenticate, isAdmin, async (req, res) => {
  const { id, status } = req.body;
  await knex('bookings').where({ id }).update({ status });
  res.json({ message: `Booking ${status}` });
});

app.get('/api/admin/users', authenticate, isAdmin, async (req, res) => {
  const users = await knex('users').select('id', 'name', 'email', 'role', 'is_active', 'is_verified');
  res.json(users);
});

app.post('/api/admin/user-status', authenticate, isAdmin, async (req, res) => {
  const { id, is_active } = req.body;
  await knex('users').where({ id }).update({ is_active });
  res.json({ message: 'User status updated' });
});

app.get('/api/admin/payments', authenticate, isAdmin, async (req, res) => {
  const payments = await knex('payments')
    .join('users', 'payments.user_id', 'users.id')
    .select('payments.*', 'users.name as user_name');
  res.json(payments);
});

const PORT = 5000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
