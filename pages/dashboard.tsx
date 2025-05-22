import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faBuilding, faBriefcase, faUpload } from '@fortawesome/free-solid-svg-icons';

// Client data access component
export default function Dashboard() {
  const { data: session, status } = useSession();
  const [clientData, setClientData] = useState(null);
  const [sharedData, setSharedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data when session is available
  useEffect(() => {
    if (status === 'authenticated' && session) {
      fetchData();
    }
  }, [status, session]);

  // Fetch client-specific and shared data
  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Fetch client-specific data
      const clientResponse = await fetch('/api/data/client');
      const clientResult = await clientResponse.json();
      
      if (!clientResponse.ok) {
        throw new Error(clientResult.error || 'Failed to fetch client data');
      }
      
      setClientData(clientResult.data);
      
      // Fetch shared data
      const sharedResponse = await fetch('/api/data/shared');
      const sharedResult = await sharedResponse.json();
      
      if (!sharedResponse.ok) {
        throw new Error(sharedResult.error || 'Failed to fetch shared data');
      }
      
      setSharedData(sharedResult.data);
    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Loading state
  if (status === 'loading' || isLoading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your dashboard...</p>
      </Container>
    );
  }

  // Not authenticated
  if (status !== 'authenticated') {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Please sign in to access your dashboard.
        </Alert>
        <Button href="/auth/signin" variant="primary">Sign In</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>TalentForge Dashboard</h1>
          <p className="text-muted">Welcome, {session.user.name || session.user.email}</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={handleSignOut}>
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
            Sign Out
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Tab.Container defaultActiveKey="employees">
        <Row>
          <Col md={3} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="employees">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Employees
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="jobs">
                      <FontAwesomeIcon icon={faBriefcase} className="me-2" />
                      Jobs
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="candidates">
                      <FontAwesomeIcon icon={faBuilding} className="me-2" />
                      Candidates
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="upload">
                      <FontAwesomeIcon icon={faUpload} className="me-2" />
                      Upload Data
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          <Col md={9}>
            <Card className="shadow-sm">
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="employees">
                    <h3 className="mb-4">Employee Data</h3>
                    {renderDataSection(clientData?.employees, sharedData?.employees)}
                  </Tab.Pane>
                  <Tab.Pane eventKey="jobs">
                    <h3 className="mb-4">Job Requirements</h3>
                    {renderDataSection(clientData?.jobs, sharedData?.jobs)}
                  </Tab.Pane>
                  <Tab.Pane eventKey="candidates">
                    <h3 className="mb-4">Candidates</h3>
                    {renderDataSection(clientData?.candidates, sharedData?.candidates)}
                  </Tab.Pane>
                  <Tab.Pane eventKey="upload">
                    <h3 className="mb-4">Upload Data</h3>
                    <p>Upload your employee data, job requirements, or candidate information.</p>
                    <Row>
                      <Col md={4}>
                        <Card className="mb-3">
                          <Card.Body className="text-center">
                            <FontAwesomeIcon icon={faUser} className="fa-2x mb-3 text-primary" />
                            <h5>Employee Data</h5>
                            <Button variant="outline-primary" size="sm">Upload</Button>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="mb-3">
                          <Card.Body className="text-center">
                            <FontAwesomeIcon icon={faBriefcase} className="fa-2x mb-3 text-primary" />
                            <h5>Job Requirements</h5>
                            <Button variant="outline-primary" size="sm">Upload</Button>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="mb-3">
                          <Card.Body className="text-center">
                            <FontAwesomeIcon icon={faBuilding} className="fa-2x mb-3 text-primary" />
                            <h5>Candidates</h5>
                            <Button variant="outline-primary" size="sm">Upload</Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

// Helper function to render data sections with client and shared data
function renderDataSection(clientItems, sharedItems) {
  const hasClientData = clientItems && clientItems.length > 0;
  const hasSharedData = sharedItems && sharedItems.length > 0;
  
  if (!hasClientData && !hasSharedData) {
    return (
      <Alert variant="info">
        No data available. Upload your data to get started.
      </Alert>
    );
  }
  
  return (
    <>
      {hasClientData && (
        <div className="mb-4">
          <h5>Your Data</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  {Object.keys(clientItems[0]).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientItems.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {hasSharedData && (
        <div>
          <h5>Shared Data</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  {Object.keys(sharedItems[0]).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sharedItems.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
