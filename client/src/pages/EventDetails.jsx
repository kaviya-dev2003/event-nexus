import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Share2, Heart, Users, DollarSign, Info, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (!event) return <Container className="py-5 mt-5 text-center"><h2>Event not found</h2><Link to="/events" className="btn btn-primary mt-3">Back to Events</Link></Container>;

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Banner */}
      <div className="position-relative" style={{ height: '400px' }}>
        <img 
          src={event.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2070'} 
          className="w-100 h-100 object-fit-cover shadow" 
          alt={event.name} 
        />
        <div className="position-absolute top-0 start-0 m-4">
          <Button as={Link} to="/events" variant="light" className="rounded-circle shadow p-2 border-0">
            <ChevronLeft size={24} />
          </Button>
        </div>
      </div>

      <Container fluid className="px-md-5 mt-n5 position-relative" style={{ marginTop: '-100px', zIndex: 10 }}>
        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-lg rounded-4 p-4 mb-4 overflow-hidden">
              <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                <div>
                  <Badge bg="primary" className="mb-2 rounded-pill px-3 py-2">{event.category}</Badge>
                  <h1 className="fw-bold display-5">{event.name}</h1>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-danger" className="rounded-circle p-2 shadow-sm border-0 bg-white">
                    <Heart size={20} />
                  </Button>
                  <Button variant="outline-primary" className="rounded-circle p-2 shadow-sm border-0 bg-white">
                    <Share2 size={20} />
                  </Button>
                </div>
              </div>

              <Row className="mb-5 gy-3">
                <Col md={6}>
                  <div className="d-flex align-items-center p-3 bg-light rounded-4">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 text-primary">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Date</small>
                      <span className="fw-bold">{event.date}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-center p-3 bg-light rounded-4">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 text-primary">
                      <Clock size={24} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Time</small>
                      <span className="fw-bold">{event.time}</span>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="d-flex align-items-center p-3 bg-light rounded-4">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 text-primary">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Location</small>
                      <span className="fw-bold">{event.location}</span>
                    </div>
                  </div>
                </Col>
              </Row>

              <h4 className="fw-bold mb-3 d-flex align-items-center">
                <Info size={22} className="text-primary me-2" /> About Event
              </h4>
              <p className="text-secondary lh-lg fs-5 mb-5">
                {event.description || "No description provided. Experience an amazing event filled with entertainment, networking, and fun. Don't miss out on this unique opportunity to connect with like-minded individuals and create lasting memories."}
              </p>

              <div className="bg-light p-4 rounded-4">
                <h5 className="fw-bold mb-3">Organizer Information</h5>
                <div className="d-flex align-items-center">
                  <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                    {event.organizer_name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">{event.organizer_name}</h6>
                    <small className="text-muted">Event Organizer</small>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-lg rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
              <h4 className="fw-bold mb-4">Ticket Details</h4>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="d-flex justify-content-between py-3 px-0 bg-transparent border-light">
                  <span className="text-muted d-flex align-items-center"><DollarSign size={18} className="me-2" /> Price per person</span>
                  <span className="fw-bold fs-4 text-primary">${event.price}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between py-3 px-0 bg-transparent border-light">
                  <span className="text-muted d-flex align-items-center"><Users size={18} className="me-2" /> Available Seats</span>
                  <span className="badge bg-light text-dark rounded-pill px-3 py-2 fw-bold">{event.available_seats} / {event.total_seats}</span>
                </ListGroup.Item>
              </ListGroup>

              {event.available_seats > 0 ? (
                <Button 
                  onClick={() => navigate(`/checkout/${id}`)}
                  variant="primary" 
                  className="w-100 py-3 rounded-pill fw-bold shadow-sm"
                  disabled={event.available_seats === 0}
                >
                  Book Tickets Now
                </Button>
              ) : (
                <Button variant="secondary" className="w-100 py-3 rounded-pill fw-bold" disabled>
                  Sold Out
                </Button>
              )}
              
              <div className="text-center mt-3">
                <small className="text-muted d-flex align-items-center justify-content-center">
                  <ShieldCheck size={14} className="me-1 text-success" /> Secure Booking & Payment
                </small>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Add this helpful icon for the bottom message
const ShieldCheck = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

export default EventDetails;
