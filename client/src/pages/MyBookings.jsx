import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Table, Button } from 'react-bootstrap';
import { Calendar, MapPin, Tag, Clock, Download, ExternalLink } from 'lucide-react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <Badge bg="success" className="rounded-pill px-3 py-2">Approved</Badge>;
      case 'pending_approval': return <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2">Pending Approval</Badge>;
      case 'pending_payment': return <Badge bg="info" className="rounded-pill px-3 py-2">Pending Payment</Badge>;
      case 'rejected': return <Badge bg="danger" className="rounded-pill px-3 py-2">Rejected</Badge>;
      default: return <Badge bg="secondary" className="rounded-pill px-3 py-2">{status}</Badge>;
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container fluid className="px-md-5">
        <div className="mb-5">
          <h2 className="fw-bold">My Bookings</h2>
          <p className="text-muted">Manage and track all your event tickets</p>
        </div>

        {bookings.length > 0 ? (
          <Row className="gy-4">
            {bookings.map((booking) => (
              <Col lg={12} key={booking.id}>
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                  <Row className="g-0 align-items-center">
                    <Col md={3}>
                      <img 
                        src={booking.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800'} 
                        className="w-100 h-100 object-fit-cover p-3 rounded-5" 
                        alt={booking.event_name}
                        style={{ minHeight: '150px' }}
                      />
                    </Col>
                    <Col md={6}>
                      <Card.Body className="p-4">
                        <div className="mb-2">{getStatusBadge(booking.status)}</div>
                        <h4 className="fw-bold mb-2">{booking.event_name}</h4>
                        <div className="d-flex flex-wrap gap-3 text-muted small">
                          <span className="d-flex align-items-center"><Calendar size={14} className="me-1" /> {booking.date}</span>
                          <span className="d-flex align-items-center"><MapPin size={14} className="me-1" /> {booking.location}</span>
                          <span className="d-flex align-items-center fw-bold text-dark"><Tag size={14} className="me-1" /> Tickets: {booking.quantity}</span>
                        </div>
                      </Card.Body>
                    </Col>
                    <Col md={3} className="border-start border-light">
                      <div className="p-4 text-center">
                        <small className="text-muted d-block mb-1">Total Paid</small>
                        <h4 className="fw-bold text-primary mb-3">${booking.total_price}</h4>
                        {booking.status === 'approved' ? (
                          <Button variant="outline-primary" size="sm" className="rounded-pill px-4 w-100 d-flex align-items-center justify-content-center gap-2">
                            <Download size={16} /> Ticket
                          </Button>
                        ) : (
                          <Button variant="light" size="sm" className="rounded-pill px-4 w-100 disabled" disabled>
                            Wait for Approval
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <h4 className="text-muted">You haven't booked any events yet.</h4>
            <p className="mb-4">Explore our upcoming events and start booking!</p>
            <Button as={Link} to="/events" variant="primary" className="rounded-pill px-5 py-2 mx-auto d-inline-block">
              Explore Events
            </Button>
          </Card>
        )}
      </Container>
    </div>
  );
};

// Internal helper for simple Link
const Link = ({ to, children, className, variant }) => (
  <a href={to} className={className}>{children}</a>
);

export default MyBookings;
