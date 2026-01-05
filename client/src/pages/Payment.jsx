import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Smartphone, Landmark, CheckCircle, ShieldCheck } from 'lucide-react';

const Payment = () => {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment delay
    setTimeout(async () => {
      try {
        const transaction_id = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
        await axios.post('http://localhost:5000/api/payments', {
          booking_id: bookingId,
          payment_method: method,
          transaction_id,
          amount: state?.amount || 0
        });
        setSuccess(true);
      } catch (err) {
        console.error('Payment failed:', err);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  if (success) {
    return (
      <Container fluid className="py-5 my-5 text-center px-md-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="border-0 shadow-lg rounded-4 p-5">
              <div className="mb-4">
                <CheckCircle size={80} className="text-success" />
              </div>
              <h2 className="fw-bold mb-3">Payment Successful!</h2>
              <p className="text-muted fs-5 mb-4">
                Your payment of <strong>${state?.amount}</strong> has been received. 
                Your booking is now waiting for admin approval.
              </p>
              <div className="d-grid gap-3">
                <Button as={Link} to="/my-bookings" variant="primary" className="py-3 rounded-pill fw-bold shadow-sm">
                  View My Bookings
                </Button>
                <Button as={Link} to="/" variant="link" className="text-decoration-none text-muted">
                  Back to Home
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Container fluid className="py-5 px-md-5">
        <Row className="justify-content-center">
        <Col lg={6}>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Secured Payment</h2>
            <p className="text-muted">Choose your preferred payment method</p>
          </div>

          <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-4">
            <div className="bg-primary p-4 text-white text-end">
              <small className="d-block opacity-75">Amount to Pay</small>
              <h3 className="fw-bold mb-0">${state?.amount}</h3>
            </div>
            
            <Card.Body className="p-4">
              <Tabs
                activeKey={method}
                onSelect={(k) => setMethod(k)}
                className="payment-tabs mb-4 border-0"
                justify
              >
                <Tab eventKey="upi" title={<span><Smartphone size={18} className="me-2" /> UPI</span>}>
                  <div className="py-3 text-center">
                    {/* <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/800px-UPI-Logo.png" 
                      alt="UPI" style={{ height: '40px' }} className="mb-4" /> */}
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold d-block text-start">Enter UPI ID</Form.Label>
                      <Form.Control placeholder="username@bank" className="bg-light py-2" />
                    </Form.Group>
                    <p className="small text-muted mb-4 text-start">
                      Open your UPI app (GPay, PhonePe, Paytm) and approve the request to complete payment.
                    </p>
                  </div>
                </Tab>
                <Tab eventKey="card" title={<span><CreditCard size={18} className="me-2" /> Card</span>}>
                  <div className="py-3">
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Card Number</Form.Label>
                      <Form.Control placeholder="XXXX XXXX XXXX XXXX" className="bg-light" />
                    </Form.Group>
                    <Row>
                      <Col xs={7}>
                        <Form.Group className="mb-3">
                          <Form.Label className="small fw-bold">Expiry Date</Form.Label>
                          <Form.Control placeholder="MM/YY" className="bg-light" />
                        </Form.Group>
                      </Col>
                      <Col xs={5}>
                        <Form.Group className="mb-3">
                          <Form.Label className="small fw-bold">CVV</Form.Label>
                          <Form.Control placeholder="XXX" type="password" className="bg-light" />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                <Tab eventKey="netbanking" title={<span><Landmark size={18} className="me-2" /> Net Banking</span>}>
                  <div className="py-3">
                    <Form.Select className="bg-light py-2">
                      <option>Select Your Bank</option>
                      <option>HDFC Bank</option>
                      <option>SBI</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                    </Form.Select>
                  </div>
                </Tab>
              </Tabs>

              <Button 
                onClick={handlePayment}
                variant="primary" 
                className="w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                    Processing...
                  </>
                ) : (
                  <>Pay Now ${state?.amount}</>
                )}
              </Button>

              <div className="text-center text-muted small">
                <ShieldCheck size={14} className="me-1 text-success d-inline" /> 
                Your transaction is secured with 256-bit encryption.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default Payment;
