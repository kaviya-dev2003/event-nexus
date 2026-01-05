import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Badge,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  ChevronRight,
  ShoppingBag,
  PlusCircle,
} from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [recentBookings, setRecentBookings] = useState([]);
  const message = location.state?.message;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/my-bookings");
        setRecentBookings(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container fluid className="px-md-5">
        {message && (
          <Alert variant="success" className="mb-4 rounded-3 shadow-sm">
            {message}
          </Alert>
        )}

        <div className="mb-5">
          <h2 className="fw-bold display-6">My Account</h2>
          <p className="text-muted lead">Welcome back, {user.name}!</p>
        </div>

        <Row className="gy-4">
          {/* Profile Card */}
          <Col lg={3}>
            <Card className="border-0 shadow-sm rounded-4 p-4 text-center h-100 bg-white">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
                style={{ width: "100px", height: "100px" }}
              >
                <User size={50} />
              </div>
              <h4 className="fw-bold mb-1">{user.name}</h4>
              <p className="text-muted mb-4 d-flex align-items-center justify-content-center">
                <Mail size={16} className="me-2" /> {user.email}
              </p>
              <Badge
                bg={user.role === "organizer" ? "success" : "info"}
                className="rounded-pill px-4 py-2 mb-4 fs-6"
              >
                {user.role.toUpperCase()} ACCOUNT
              </Badge>
              <hr className="w-100 border-light my-4" />
              <div className="d-grid mt-2">
                <Button
                  variant="outline-primary"
                  className="rounded-pill py-2 fw-bold"
                >
                  Edit Profile
                </Button>
              </div>
            </Card>
          </Col>

          {/* Activity Overview */}
          <Col lg={9}>
            <Row className="gy-4">
              {user.role === "organizer" && (
                <Col md={12}>
                  <Card className="border-0 shadow-sm rounded-4 p-5 bg-primary text-white overflow-hidden position-relative">
                    <div className="position-relative" style={{ zIndex: 1 }}>
                      <h2 className="fw-bold mb-3">
                        Want to host a new event?
                      </h2>
                      <p className="opacity-75 mb-4 fs-5">
                        Create and manage your professional events, track
                        attendees, and grow your community.
                      </p>
                      <Button
                        as={Link}
                        to="/host"
                        variant="light"
                        className="rounded-pill px-5 py-3 fw-bold fs-5 shadow-sm"
                      >
                        <PlusCircle size={22} className="me-2" /> Host New Event
                      </Button>
                    </div>
                    <Calendar
                      size={200}
                      className="position-absolute end-0 bottom-0 opacity-10 mb-n5 me-n3 rotate-12"
                    />
                  </Card>
                </Col>
              )}

              <Col md={12}>
                <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <h4 className="fw-bold mb-0">Recent Activity</h4>
                    <Link
                      to="/my-bookings"
                      className="btn btn-link text-decoration-none fw-bold"
                    >
                      View All Bookings <ChevronRight size={18} />
                    </Link>
                  </div>

                  {recentBookings.length > 0 ? (
                    <ListGroup variant="flush">
                      {recentBookings.map((b) => (
                        <ListGroup.Item
                          key={b.id}
                          className="px-0 py-4 bg-transparent border-light d-flex align-items-center"
                        >
                          {/* <img 
                            src={b.image_url || 'https://via.placeholder.com/100'} 
                            className="rounded-4 me-4 shadow-sm" 
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                            alt={b.event_name}
                          /> */}
                          .
                          <img
                            src={
                              b.image_url ||
                              "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=200"
                            }
                            className="rounded-4 me-4 shadow-sm"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                            alt={b.event_name || "Live Symphony Orchestra"}
                          />
                          <div className="flex-grow-1">
                            <h5 className="fw-bold mb-2">{b.event_name}</h5>
                            <div className="d-flex gap-4 text-muted small">
                              <span className="d-flex align-items-center">
                                <Calendar size={14} className="me-2" /> {b.date}
                              </span>
                              <span className="d-flex align-items-center">
                                <MapPin size={14} className="me-2" />{" "}
                                {b.location}
                              </span>
                            </div>
                          </div>
                          <div className="text-end ms-3">
                            <Badge
                              bg={
                                b.status === "approved" ? "success" : "warning"
                              }
                              className="rounded-pill px-3 py-2 mb-2"
                            >
                              {b.status === "approved"
                                ? "Approved"
                                : "Pending Approval"}
                            </Badge>
                            <div className="fw-bold text-primary fs-5">
                              ${b.total_price}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className="text-center py-5 bg-light rounded-4 border-dashed border-2">
                      <ShoppingBag
                        size={60}
                        className="text-muted mb-3 opacity-25"
                      />
                      <h5 className="text-muted mb-2">
                        No recent bookings found
                      </h5>
                      <p className="text-muted mb-4 px-4">
                        You haven't booked any events yet. Start exploring now!
                      </p>
                      <Button
                        as={Link}
                        to="/events"
                        variant="primary"
                        className="rounded-pill px-5 py-2 fw-bold shadow-sm"
                      >
                        Discover Amazing Events
                      </Button>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
