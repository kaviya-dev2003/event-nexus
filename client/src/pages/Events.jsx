import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Badge } from 'react-bootstrap';
import { Search, Filter, Calendar, MapPin, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['Music', 'Corporate', 'Wedding', 'Workshop', 'Birthday', 'Tech'];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/events?search=${search}&category=${category}`);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category]); // Fetch on category change, search handled by button

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container fluid className="px-md-5">
        <div className="mb-5 text-center">
          <h1 className="fw-bold mb-3">Discover Events</h1>
          <p className="text-muted lead">Find the best experiences happening near you</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-4 shadow-sm mb-5 border">
          <Form onSubmit={handleSearchSubmit}>
            <Row className="gy-3 align-items-center">
              <Col lg={5}>
                <InputGroup className="border rounded-pill overflow-hidden">
                  <InputGroup.Text className="bg-white border-0 ps-3">
                    <Search size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search for event name..."
                    className="border-0 shadow-none py-2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col lg={3} md={6}>
                <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
                  <SlidersHorizontal size={18} className="text-muted me-2" />
                  <Form.Select 
                    className="bg-transparent border-0 shadow-none p-0 fw-bold small"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </Form.Select>
                </div>
              </Col>
              <Col lg={2} md={6}>
                <Button variant="primary" type="submit" className="w-100 rounded-pill py-2 shadow-sm fw-bold">
                  Search
                </Button>
              </Col>
              <Col lg={2} className="text-lg-end">
                <Button variant="link" className="text-decoration-none text-muted p-0" onClick={() => { setSearch(''); setCategory(''); }}>
                  Reset Filters
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Searching for events...</p>
          </div>
        ) : (
          <Row>
            {events.length > 0 ? (
              events.map((event) => (
                <Col key={event.id} lg={4} md={6} className="mb-4">
                  <Card className="border-0 shadow-sm h-100 event-card rounded-4 overflow-hidden bg-white">
                    <div className="position-relative" style={{ height: '200px' }}>
                      <Card.Img variant="top" src={event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800'} 
                        className="h-100 w-100 object-fit-cover" />
                      <Badge bg="primary" className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm">
                        {event.category}
                      </Badge>
                    </div>
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted d-flex align-items-center">
                          <Calendar size={14} className="me-1" /> {event.date}
                        </small>
                        <small className="text-primary fw-bold fs-5">${event.price}</small>
                      </div>
                      <h5 className="fw-bold mb-3">{event.name}</h5>
                      <div className="mb-4 text-muted small d-flex flex-column gap-2">
                        <div className="d-flex align-items-center"><MapPin size={14} className="me-2" /> {event.location}</div>
                        <div className="d-flex align-items-center fw-bold text-dark">Seats: {event.available_seats} / {event.total_seats}</div>
                      </div>
                      <Button as={Link} to={`/events/${event.id}`} variant="primary" className="w-100 rounded-pill py-2 fw-bold shadow-sm">
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center py-5">
                <h3 className="text-muted mb-3">No events match your criteria</h3>
                <p>Try different keywords or browse all categories.</p>
                <Button variant="outline-primary" className="rounded-pill px-4 mt-2" onClick={() => { setSearch(''); setCategory(''); }}>
                  See All Events
                </Button>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Events;
