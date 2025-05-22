import { useSession } from 'next-auth/react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="py-5">
              <h1 className="display-4 fw-bold mb-4">Transform Manufacturing Talent from Liability to Strategic Advantage</h1>
              <p className="lead mb-4">AI-Powered Talent Intelligence for Manufacturing Leaders</p>
              <div className="d-grid gap-2 d-md-flex">
                {session ? (
                  <Link href="/dashboard" passHref>
                    <Button variant="light" size="lg" className="px-4 me-md-2">Access Dashboard</Button>
                  </Link>
                ) : (
                  <Link href="/auth/signin" passHref>
                    <Button variant="light" size="lg" className="px-4 me-md-2">Get Started</Button>
                  </Link>
                )}
                <Button variant="outline-light" size="lg" className="px-4">Learn More</Button>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <img 
                src="/hero-image.svg" 
                alt="TalentForge Platform" 
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="fw-bold">Manufacturing Talent Intelligence</h2>
            <p className="lead text-muted">Powered by AI and industry expertise</p>
          </Col>
        </Row>
        
        <Row className="g-4">
          <Col md={4}>
            <div className="text-center p-4 h-100 border rounded shadow-sm">
              <div className="feature-icon text-primary mb-3">
                <i className="fas fa-chart-line fa-3x"></i>
              </div>
              <h3>Predictive Analytics</h3>
              <p>Forecast future skills needs and potential talent gaps before they impact operations.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center p-4 h-100 border rounded shadow-sm">
              <div className="feature-icon text-primary mb-3">
                <i className="fas fa-user-shield fa-3x"></i>
              </div>
              <h3>Retention Intelligence</h3>
              <p>Identify flight risks and implement targeted retention strategies for critical talent.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center p-4 h-100 border rounded shadow-sm">
              <div className="feature-icon text-primary mb-3">
                <i className="fas fa-cogs fa-3x"></i>
              </div>
              <h3>Workforce Simulation</h3>
              <p>Test talent strategies in a virtual environment before implementing them in your organization.</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h2 className="fw-bold mb-4">Ready to transform your manufacturing talent strategy?</h2>
              <p className="lead mb-4">Join leading manufacturers who are using TalentForge to turn talent into a strategic advantage.</p>
              <Link href={session ? "/dashboard" : "/auth/signin"} passHref>
                <Button variant="primary" size="lg" className="px-5">
                  {session ? "Access Dashboard" : "Get Started"}
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col md={6}>
              <h4>TalentForge</h4>
              <p>Transforming manufacturing talent management through AI-powered intelligence.</p>
            </Col>
            <Col md={6} className="text-md-end">
              <p>&copy; {new Date().getFullYear()} TalentForge. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}
