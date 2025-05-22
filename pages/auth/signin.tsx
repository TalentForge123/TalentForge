import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setMessage('Check your email for a sign in link!');
        setEmail('');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2>Sign in to TalentForge</h2>
                <p className="text-muted">Manufacturing Talent Intelligence Platform</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}

              <div className="d-grid gap-2 mb-4">
                <Button 
                  variant="outline-secondary" 
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                >
                  <FontAwesomeIcon icon={faGoogle} />
                  <span>Continue with Google</span>
                </Button>
                
                <Button 
                  variant="outline-secondary" 
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={() => signIn('github', { callbackUrl: '/' })}
                >
                  <FontAwesomeIcon icon={faGithub} />
                  <span>Continue with GitHub</span>
                </Button>
              </div>

              <div className="position-relative mb-4">
                <hr />
                <div className="position-absolute top-50 start-50 translate-middle bg-white px-3">
                  <span className="text-muted">Or</span>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    We'll send you a magic link to sign in
                  </Form.Text>
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isLoading}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>{isLoading ? 'Sending...' : 'Send Magic Link'}</span>
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
