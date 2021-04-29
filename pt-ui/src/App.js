import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import { Container, Row, Col, Button, Navbar } from 'react-bootstrap'
import env from "react-dotenv";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [camFeedURL, setCamFeed] = useState(`${env.API_URL}/uploaded/feed.jpg`);

  useEffect(() => {
    const interval = setInterval(() => {
      setCamFeed(`${env.API_URL}/uploaded/feed.jpg?v=${Math.random()}`)
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendArmRequest = () => {
    debugger;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ arm: true })
    };
    fetch(env.FILE_API_URL + "/api/arm-home", requestOptions)
      .then(response => response.json())
      .then(data => {});
  }

  const sendDisarmRequest = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ arm: true })
    };
    fetch(env.FILE_API_URL + "/api/disarm-home", requestOptions)
      .then(response => response.json())
      .then(data => {});
  }

  return (
    <div className="app">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">Home Securiteeeee</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Navbar>
      <Container fluid>
        <Row>
          <Col md={4} md={{ span: 4, offset: 2 }}>
            <h3>Live camera feed (Updates every 5 seconds)</h3>
            <img src={camFeedURL} />
          </Col>
          <Col md={4} className="text-center">
            <h3>Available Actions</h3>
            <div className="d-flex justify-content-around">
              <Button onClick={sendArmRequest}>Arm</Button>
              <Button onClick={sendDisarmRequest}>Disarm</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>

  );
}

export default App;
