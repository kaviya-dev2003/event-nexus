import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 d-inline-block p-3 rounded-circle mb-3">
                  <LogIn className="text-primary" size={32} />
                </div>
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Login to manage your bookings and events</p>
              </div>

              {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <Mail size={18} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      className="bg-light border-start-0 ps-0"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold">Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <Lock size={18} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      className="bg-light border-start-0 ps-0"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                </Button>
              </Form>

              <div className="text-center">
                <p className="text-muted mb-0">Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Register here</Link></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
