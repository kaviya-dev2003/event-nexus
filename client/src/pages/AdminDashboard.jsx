import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Table, Button, Badge, Alert } from 'react-bootstrap';
import { LayoutDashboard, Calendar, ShoppingCart, Users, DollarSign, Check, X, Shield, Lock, Unlock } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');

  const API_BASE = 'http://localhost:5000/api/admin';

  const fetchData = async () => {
    setLoading(true);
    try {
      // Use try-catch for each to prevent one failing request from breaking the whole dashboard
      const fetchItem = async (url) => {
        try {
          const res = await axios.get(url);
          return res.data;
        } catch (err) {
          console.error(`Error fetching ${url}:`, err);
          return null; // Return null on error
        }
      };

      const [sData, eData, bData, uData, pData] = await Promise.all([
        fetchItem(`${API_BASE}/stats`),
        fetchItem(`${API_BASE}/pending-events`),
        fetchItem(`${API_BASE}/pending-bookings`),
        fetchItem(`${API_BASE}/users`),
        fetchItem(`${API_BASE}/payments`)
      ]);

      if (sData) setStats(sData);
      if (eData) setPendingEvents(eData);
      if (bData) setPendingBookings(bData);
      if (uData) setUsers(uData);
      if (pData) setPayments(pData);
    } catch (err) {
      console.error('Unexpected error in fetchData:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEventApproval = async (id, status) => {
    await axios.post('http://localhost:5000/api/admin/approve-event', { id, status });
    fetchData();
  };

  const handleBookingApproval = async (id, status) => {
    await axios.post('http://localhost:5000/api/admin/approve-booking', { id, status });
    fetchData();
  };

  const handleUserStatus = async (id, currentStatus) => {
    await axios.post('http://localhost:5000/api/admin/user-status', { id, is_active: !currentStatus });
    fetchData();
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container fluid className="px-md-5">
        <div className="mb-5">
          <h2 className="fw-bold">Admin Control Room</h2>
          <p className="text-muted">Manage the platform and oversee all activities</p>
        </div>

        {/* Stats Section */}
        <Row className="mb-5 gy-4 text-white">
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-4 bg-primary p-4 h-100 position-relative">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <small className="opacity-75">Total Events</small>
                  <h2 className="fw-bold mb-0">{stats.totalEvents || 0}</h2>
                </div>
                <Calendar size={40} className="opacity-25" />
              </div>
              <div className="mt-3">
                <Button variant="light" size="sm" className="rounded-pill px-3 py-1 opacity-75 small fw-bold" onClick={() => { setActiveTab('events'); window.scrollTo(0, 500); }}>View All</Button>
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-4 bg-info p-4 h-100 position-relative">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <small className="opacity-75">Pending Approvals</small>
                  <h2 className="fw-bold mb-0">{stats.pendingEvents || 0}</h2>
                </div>
                <Shield size={40} className="opacity-25" />
              </div>
              <div className="mt-3">
                <Button variant="light" size="sm" className="rounded-pill px-3 py-1 opacity-75 small fw-bold" onClick={() => { setActiveTab('events'); window.scrollTo(0, 500); }}>Approve Events</Button>
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-4 bg-success p-4 h-100 position-relative">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <small className="opacity-75">Pending Bookings</small>
                  <h2 className="fw-bold mb-0">{stats.pendingBookings || 0}</h2>
                </div>
                <ShoppingCart size={40} className="opacity-25" />
              </div>
              <div className="mt-3">
                <Button variant="light" size="sm" className="rounded-pill px-3 py-1 opacity-75 small fw-bold" onClick={() => { setActiveTab('bookings'); window.scrollTo(0, 500); }}>Approve Bookings</Button>
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-4 bg-dark p-4 h-100 position-relative">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <small className="opacity-75">Total Revenue</small>
                  <h2 className="fw-bold mb-0">${stats.totalRevenue || 0}</h2>
                </div>
                <DollarSign size={40} className="opacity-25" />
              </div>
              <div className="mt-3">
                <Button variant="light" size="sm" className="rounded-pill px-3 py-1 opacity-75 small fw-bold" onClick={() => { setActiveTab('payments'); window.scrollTo(0, 500); }}>Payments</Button>
              </div>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow rounded-4 p-4 bg-white">
          <Tabs 
            activeKey={activeTab} 
            onSelect={(k) => setActiveTab(k)} 
            className="admin-tabs mb-4 border-0"
          >
            {/* Event Approval */}
            <Tab eventKey="events" title="Event Approvals">
              <div className="py-3">
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr className="text-secondary small">
                      <th>Event Name</th>
                      <th>Organizer</th>
                      <th>Date</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingEvents.length > 0 ? pendingEvents.map(e => (
                      <tr key={e.id}>
                        <td><span className="fw-bold">{e.name}</span><br/><small className="text-muted">{e.category}</small></td>
                        <td>{e.organizer_name}</td>
                        <td>{e.date}</td>
                        <td className="fw-bold text-primary">${e.price}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="success" size="sm" onClick={() => handleEventApproval(e.id, 'approved')}><Check size={16} /></Button>
                            <Button variant="danger" size="sm" onClick={() => handleEventApproval(e.id, 'rejected')}><X size={16} /></Button>
                          </div>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="5" className="text-center py-4">No pending event approvals</td></tr>}
                  </tbody>
                </Table>
              </div>
            </Tab>

            {/* Booking Approval */}
            <Tab eventKey="bookings" title="Booking Approvals">
              <div className="py-3">
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr className="text-secondary small">
                      <th>Event</th>
                      <th>User</th>
                      <th>Qty</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBookings.length > 0 ? pendingBookings.map(b => (
                      <tr key={b.id}>
                        <td className="fw-bold">{b.event_name}</td>
                        <td>{b.user_name}</td>
                        <td>{b.quantity}</td>
                        <td className="fw-bold">${b.total_price}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="success" size="sm" onClick={() => handleBookingApproval(b.id, 'approved')}>Approve</Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleBookingApproval(b.id, 'rejected')}>Reject</Button>
                          </div>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="5" className="text-center py-4">No pending bookings to review</td></tr>}
                  </tbody>
                </Table>
              </div>
            </Tab>

            {/* User Management */}
            <Tab eventKey="users" title="Management">
              <div className="py-3">
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr className="text-secondary small">
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="fw-bold">{u.name}</td>
                        <td>{u.email}</td>
                        <td><Badge bg={u.role === 'admin' ? 'dark' : (u.role === 'organizer' ? 'success' : 'info')}>{u.role}</Badge></td>
                        <td>{u.is_active ? <Badge bg="success">Active</Badge> : <Badge bg="danger">Blocked</Badge>}</td>
                        <td>
                          <Button 
                            variant={u.is_active ? "outline-danger" : "outline-success"} 
                            size="sm" 
                            disabled={u.role === 'admin'}
                            onClick={() => handleUserStatus(u.id, u.is_active)}
                          >
                            {u.is_active ? <Lock size={14} /> : <Unlock size={14} />} 
                            {u.is_active ? " Block" : " Unblock"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tab>

            {/* Payment History */}
            <Tab eventKey="payments" title="Payment Stream">
              <div className="py-3">
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr className="text-secondary small">
                      <th>Transaction ID</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id}>
                        <td className="font-monospace small">{p.transaction_id}</td>
                        <td>{p.user_name}</td>
                        <td className="fw-bold">${p.amount}</td>
                        <td>{p.payment_method.toUpperCase()}</td>
                        <td><Badge bg="success">COMPLETED</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </Card>
      </Container>
    </div>
  );
};

export default AdminDashboard;
