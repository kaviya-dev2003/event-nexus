import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 d-inline-block p-3 rounded-circle mb-3">
                  <UserPlus className="text-primary" size={32} />
                </div>
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Join the EventNexus community today</p>
              </div>

              {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Full Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0">
                          <User size={18} className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          name="name"
                          placeholder="John Doe"
                          className="bg-light border-start-0 ps-0"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Email Address</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0">
                          <Mail size={18} className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          className="bg-light border-start-0 ps-0"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0">
                          <Lock size={18} className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          className="bg-light border-start-0 ps-0"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold">Register As</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0">
                          <ShieldCheck size={18} className="text-muted" />
                        </InputGroup.Text>
                        <Form.Select 
                          name="role" 
                          className="bg-light border-start-0 ps-0"
                          value={formData.role}
                          onChange={handleChange}
                        >
                          <option value="user">User (Book Tickets)</option>
                          <option value="organizer">Organizer (Host Events)</option>
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Create Account'}
                </Button>
              </Form>

              <div className="text-center">
                <p className="text-muted mb-0">Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Login here</Link></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
