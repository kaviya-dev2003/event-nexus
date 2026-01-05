import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  MapPin,
  Star,
  ShieldCheck,
  Zap,
  ArrowRight,
  Music,
  Heart,
  Briefcase,
  Camera,
} from "lucide-react";

const Home = () => {
  const categories = [
    { name: "Music", icon: <Music size={32} />, color: "bg-primary" },
    { name: "Corporate", icon: <Briefcase size={32} />, color: "bg-info" },
    { name: "Weddings", icon: <Heart size={32} />, color: "bg-danger" },
    { name: "Workshops", icon: <Zap size={32} />, color: "bg-warning" },
    { name: "Photography", icon: <Camera size={32} />, color: "bg-success" },
  ];

  const orchestraImages = [
    "https://images.unsplash.com/photo-1506157786151-b8491531f063", // Grand orchestra stage
    "https://images.unsplash.com/photo-1519683109079-d5f539e1542f", // Violin close-up with lights
    "https://images.unsplash.com/photo-1513883049090-d0b7439799bf", // Live concert cinematic shot
    "https://images.unsplash.com/photo-1485579149621-3123dd979885", // Conductor & orchestra mood
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="hero-section text-white py-5 mb-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2070")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container fluid className="px-md-5">
          <Row className="align-items-center">
            <Col lg={7} className="animate__animated animate__fadeInLeft">
              <Badge bg="primary" className="mb-3 rounded-pill px-3 py-2 fs-6">
                Ultimate Event Management
              </Badge>
              <h1 className="display-2 fw-bold mb-4">
                Create Memories That Last a Lifetime
              </h1>
              <p className="lead fs-3 mb-5 fw-light">
                From intimate gatherings to grand festivals, Event Nexus is the
                all-in-one platform to find, host, and manage extraordinary
                experiences.
              </p>
              <div className="d-flex gap-3">
                <Button
                  as={Link}
                  to="/events"
                  variant="primary"
                  size="lg"
                  className="rounded-pill px-5 py-3 fw-bold fs-5 shadow-lg"
                >
                  Explore Events <ArrowRight size={22} className="ms-2" />
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-light"
                  size="lg"
                  className="rounded-pill px-5 py-3 fw-bold fs-5"
                >
                  Get Started
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-5">
        <Container fluid className="px-md-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5">Explore by Category</h2>
            <p className="text-muted fs-5">
              Find the perfect event for your interests
            </p>
          </div>
          <Row className="gy-4 justify-content-center">
            {categories.map((cat, index) => (
              <Col key={index} xs={6} md={4} lg={2}>
                <Card className="category-card border-0 shadow-sm rounded-4 text-center p-4 hover-lift transition-all h-100 bg-light">
                  <div
                    className={`${cat.color} text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow`}
                    style={{ width: "80px", height: "80px" }}
                  >
                    {cat.icon}
                  </div>
                  <h5 className="fw-bold">{cat.name}</h5>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Popular Events Preview */}
      <section className="py-5 bg-light">
        <Container fluid className="px-md-5">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-bold display-5">Trending Events</h2>
              <p className="text-muted fs-5">
                Don't miss out on these sell-out experiences
              </p>
            </div>
            <Button
              as={Link}
              to="/events"
              variant="primary"
              className="rounded-pill px-4 py-2 fw-bold"
            >
              View All Events
            </Button>
          </div>
          <Row className="gy-4">
            {[1, 2, 3, 4].map((i) => (
              <Col key={i} md={6} lg={3}>
                <Card className="border-0 shadow-premium rounded-4 overflow-hidden h-100 transition-all hover-lift">
                  <div className="position-relative overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={`${
                        orchestraImages[i % orchestraImages.length]
                      }?auto=format&fit=crop&q=80&w=600`}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <Badge
                        bg="white"
                        className="text-dark p-2 rounded-circle shadow-sm"
                      >
                        <Heart size={20} className="text-danger" />
                      </Badge>
                    </div>
                  </div>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge
                        bg="primary-subtle"
                        className="text-primary rounded-pill px-3 py-1"
                      >
                        Music
                      </Badge>
                      <span className="fw-bold text-primary fs-5">$99.00</span>
                    </div>
                    <h4 className="fw-bold mb-3">
                      Live Symphony Orchestra {i}
                    </h4>
                    <div className="text-muted small mb-4">
                      <div className="mb-2">
                        <Calendar size={16} className="me-2" /> Aug 15, 2024
                      </div>
                      <div>
                        <MapPin size={16} className="me-2" /> City Grand Arena,
                        CA
                      </div>
                    </div>
                    <Button
                      as={Link}
                      to="/events"
                      variant="dark"
                      className="w-100 rounded-pill py-2 fw-bold"
                    >
                      Book Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 bg-white mb-5">
        <Container fluid className="px-md-5">
          <Row className="align-items-center gy-5">
            <Col lg={6}>
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069"
                className="img-fluid rounded-5 shadow-lg"
                alt="Why Choose Us"
              />
            </Col>
            <Col lg={6} className="ps-lg-5">
              <h2 className="fw-bold display-4 mb-4">
                The Smartest Way to Manage Events
              </h2>
              <Row className="gy-4">
                <Col md={12}>
                  <div className="d-flex align-items-start p-4 bg-light rounded-4 shadow-sm border-start border-primary border-4">
                    <ShieldCheck
                      size={32}
                      className="text-primary me-3 flex-shrink-0"
                    />
                    <div>
                      <h5 className="fw-bold">Secure Transactions</h5>
                      <p className="text-muted mb-0">
                        Every ticket purchase and payout is protected by
                        enterprise-grade security protocols.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="d-flex align-items-start p-4 bg-light rounded-4 shadow-sm border-start border-primary border-4">
                    <Users
                      size={32}
                      className="text-primary me-3 flex-shrink-0"
                    />
                    <div>
                      <h5 className="fw-bold">Global Community</h5>
                      <p className="text-muted mb-0">
                        Connect with millions of event lovers and expert
                        organizers from around the world.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="d-flex align-items-start p-4 bg-light rounded-4 shadow-sm border-start border-primary border-4">
                    <Zap
                      size={32}
                      className="text-primary me-3 flex-shrink-0"
                    />
                    <div>
                      <h5 className="fw-bold">Seamless Integration</h5>
                      <p className="text-muted mb-0">
                        Manage bookings, payments, and approvals in real-time
                        with our intuitive control center.
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

// Add Badge for the layout
const Badge = ({ children, bg, className }) => (
  <span className={`badge bg-${bg} ${className}`}>{children}</span>
);

export default Home;
