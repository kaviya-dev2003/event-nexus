import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Minus, Plus, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/bookings', { event_id: id, quantity });
      navigate(`/payment/${res.data.id}`, { state: { amount: event.price * quantity } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <Container fluid className="py-5 px-md-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h2 className="fw-bold mb-4">Review Your Booking</h2>
          
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <Row className="g-0">
              <Col md={4}>
                <img 
                  src={event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800'} 
                  className="w-100 h-100 object-fit-cover" 
                  alt={event.name} 
                />
              </Col>
              <Col md={8}>
                <Card.Body className="p-4">
                  <h4 className="fw-bold mb-1">{event.name}</h4>
                  <p className="text-muted mb-3">{event.date} • {event.location}</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold text-primary fs-5">${event.price} / ticket</span>
                    <Badge bg="light" text="dark" className="border">Available: {event.available_seats}</Badge>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>

          <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-4">Select Quantity</h5>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-4 mb-4">
              <span className="fw-medium">Number of Tickets</span>
              <div className="d-flex align-items-center gap-3">
                <Button 
                  variant="white" 
                  className="rounded-circle border shadow-sm p-1" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={20} />
                </Button>
                <span className="fw-bold fs-5 px-3">{quantity}</span>
                <Button 
                  variant="white" 
                  className="rounded-circle border shadow-sm p-1" 
                  onClick={() => setQuantity(Math.min(event.available_seats, quantity + 1))}
                >
                  <Plus size={20} />
                </Button>
              </div>
            </div>

            <hr className="my-4 border-light" />

            <h5 className="fw-bold mb-3">Price Summary</h5>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between bg-transparent px-0 py-2 border-0">
                <span className="text-secondary">${event.price} x {quantity} tickets</span>
                <span className="fw-medium">${event.price * quantity}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between bg-transparent px-0 py-2 border-0">
                <span className="text-secondary">Service Fee</span>
                <span className="fw-medium text-success">FREE</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between bg-transparent px-0 py-3 mt-2 border-top border-2 border-light">
                <span className="fw-bold fs-5">Total Amount</span>
                <span className="fw-bold fs-4 text-primary">${event.price * quantity}</span>
              </ListGroup.Item>
            </ListGroup>

            <Button 
              onClick={handleBooking}
              variant="primary" 
              className="w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-4"
            >
              Proceed to Payment <ArrowRight size={20} />
            </Button>
            
            <p className="text-center text-muted small mt-3">
              <ShieldCheck size={14} className="me-1 text-success d-inline" /> 
              Instant booking confirmation after payment approval
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Help helper for Badge if not imported
const Badge = ({ children, bg, text, className }) => (
  <span className={`badge bg-${bg} text-${text} ${className}`}>{children}</span>
);

export default Checkout;
