import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <Container fluid className="px-md-5">
        <Row className="gy-4">
          <Col lg={4}>
            <h4 className="fw-bold text-primary mb-3">EventNexus</h4>
            <p className="text-secondary">
              Discover, host, and book amazing events all in one place. Your ultimate destination for memorable experiences.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-secondary hover-primary"><Facebook size={20} /></a>
              <a href="#" className="text-secondary hover-primary"><Twitter size={20} /></a>
              <a href="#" className="text-secondary hover-primary"><Instagram size={20} /></a>
            </div>
          </Col>
          <Col lg={2} md={4}>
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/events" className="text-secondary text-decoration-none">All Events</a></li>
              <li className="mb-2"><a href="/host" className="text-secondary text-decoration-none">Host an Event</a></li>
              <li className="mb-2"><a href="/login" className="text-secondary text-decoration-none">Organizer Login</a></li>
            </ul>
          </Col>
          <Col lg={3} md={4}>
            <h5 className="mb-3">Categories</h5>
            <ul className="list-unstyled text-secondary">
              <li className="mb-2">Music & Concerts</li>
              <li className="mb-2">Tech & Business</li>
              <li className="mb-2">Weddings & Parties</li>
              <li className="mb-2">Workshops & Classes</li>
            </ul>
          </Col>
          <Col lg={3} md={4}>
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled text-secondary">
              <li className="mb-2 d-flex align-items-center"><Mail size={16} className="me-2" /> support@eventnexus.com</li>
              <li className="mb-2 d-flex align-items-center"><Phone size={16} className="me-2" /> +1 234 567 890</li>
              <li className="mb-2 d-flex align-items-center"><MapPin size={16} className="me-2" /> 123 Event St, Celebration City</li>
            </ul>
          </Col>
        </Row>
        <hr className="mt-5 mb-4 border-secondary" />
        <Row>
          <Col className="text-center text-secondary">
            <small>&copy; {new Date().getFullYear()} EventNexus. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
