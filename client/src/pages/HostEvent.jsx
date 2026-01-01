import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, MapPin, Tag, Image, DollarSign, Users, FileText, Send } from 'lucide-react';

const HostEvent = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Music',
    date: '',
    time: '',
    location: '',
    description: '',
    price: '',
    total_seats: '',
    image_url: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/events', formData);
      navigate('/dashboard', { state: { message: 'Event submitted successfully! Waiting for admin approval.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-5 px-md-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="mb-5">
            <h2 className="fw-bold mb-2">Host an Event</h2>
            <p className="text-muted">Fill in the details to submit your event for approval</p>
          </div>

          <Card className="border-0 shadow-lg rounded-4 overflow-hidden bg-white">
            <Card.Body className="p-5">
              {error && <Alert variant="danger" className="rounded-3 mb-4">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row className="gy-4">
                  {/* Basic Info */}
                  <Col md={12}>
                    <h5 className="fw-bold mb-3 d-flex align-items-center"><FileText size={20} className="text-primary me-2" /> Basic Information</h5>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Event Name</Form.Label>
                      <Form.Control 
                        name="name" 
                        placeholder="e.g. Summer Music Festival 2024" 
                        className="bg-light border-0 py-2 px-3"
                        onChange={handleChange}
                        required 
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold d-flex align-items-center"><Tag size={16} className="me-2" /> Category</Form.Label>
                      <Form.Select name="category" className="bg-light border-0 py-2 px-3" onChange={handleChange}>
                        <option>Music</option>
                        <option>Corporate</option>
                        <option>Wedding</option>
                        <option>Workshop</option>
                        <option>Birthday</option>
                        <option>Tech</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold d-flex align-items-center"><Image size={16} className="me-2" /> Event Image URL</Form.Label>
                      <Form.Control 
                        name="image_url" 
                        placeholder="https://example.com/image.jpg" 
                        className="bg-light border-0 py-2 px-3"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Date & Location */}
                  <Col md={12}><hr className="my-2 border-light" /></Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold d-flex align-items-center"><Calendar size={16} className="me-2" /> Date</Form.Label>
                      <Form.Control 
                        name="date" 
                        type="date" 
                        className="bg-light border-0 py-2 px-3"
                        onChange={handleChange}
                        required 
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold d-flex align-items-center"><Clock size={16} className="me-2" /> Time</Form.Label>
                      <Form.Control 
                        name="time" 
                        type="time" 
                        className="bg-light border-0 py-2 px-3"
                        onChange={handleChange}
                        required 
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold d-flex align-items-center"><MapPin size={16} className="me-2" /> Location</Form.Label>
                      <Form.Control 
                        name="location" 
                        placeholder="e.g. City Garden, Main St" 
                        className="bg-light border-0 py-2 px-3"
                        onChange={handleChange}
                        required 
                      />
                    </Form.Group>
                  </Col>

                  {/* Capacity & Price */}
                  <Col md={12}><hr className="my-2 border-light" /></Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold d-flex align-items-center"><DollarSign size={16} className="me-2" /> Ticket Price ($)</Form.Label>
                      <Form.Control 
                        name="price" 
                        type="number" 
                        placeholder="0.00" 
                        className="bg-light border-0 py-2 px-3"
                        onChange={handleChange}
                        required 
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold d-flex align-items-center"><Users size={16} className="me-2" /> Total Seats Capacity</Form.Label>
                      <Form.Control 
                        name="total_seats" 
                        type="number" 
                        placeholder="e.g. 100" 
                        className="bg-light border-0 py-2 px-3"
                        onChange={handleChange}
                        required 
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Description</Form.Label>
                      <Form.Control 
                        name="description" 
                        as="textarea" 
                        rows={5} 
                        placeholder="Write something about your event..." 
                        className="bg-light border-0 py-3 px-3 rounded-4"
                        onChange={handleChange}
                        required 
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12} className="text-center mt-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg" 
                      className="rounded-pill px-5 py-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : <><Send size={20} /> Submit Event for Approval</>}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HostEvent;
