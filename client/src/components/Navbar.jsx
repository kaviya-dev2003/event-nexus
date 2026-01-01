import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { ShoppingCart, User, LogOut, PlusSquare, LayoutDashboard } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-3 px-2">
      <Container fluid className="px-md-5">
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-primary">
          Event<span className="text-white">Nexus</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/events" className="px-3">Events</Nav.Link>
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin" className="px-3 text-info">
                    <LayoutDashboard size={18} className="me-1" /> Admin
                  </Nav.Link>
                )}
                {user.role === 'organizer' && (
                  <Nav.Link as={Link} to="/host" className="px-3 text-success">
                    <PlusSquare size={18} className="me-1" /> Host Event
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/my-bookings" className="px-3">
                  <ShoppingCart size={18} className="me-1" /> Bookings
                </Nav.Link>
                <NavDropdown 
                  title={<span><User size={18} className="me-1" /> {user.name}</span>} 
                  id="user-dropdown"
                  align="end"
                  className="px-3"
                >
                  <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    <LogOut size={18} className="me-1" /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="px-3">Login</Nav.Link>
                <Button as={Link} to="/register" variant="primary" className="ms-lg-3 rounded-pill px-4">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
