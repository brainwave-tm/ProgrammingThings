import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import { Container, Row, Col, Button, Navbar, Image, Table, Modal, Card } from 'react-bootstrap'
import env from "react-dotenv";
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';

function App() {
  const [camFeedURL, setCamFeed] = useState(`${env.API_URL}/uploaded/feed.jpg`);
  const [events, setEvents] = useState([]);
  const [recentfaces, setRecentFaces] = useState([]);
  const [popupImageURL, setPopupImageUrl] = useState("");
  const [showImagePopup, setShowImagePopup] = useState(false)
  const [piOnlineStatus, setPiOnlineStatus] = useState(false)
  const [armedStatus, setArmedStatus] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCamFeed(`${env.API_URL}/uploaded/feed.jpg?v=${Math.random()}`)
      fetch(`${env.API_URL}api/events?offset=0&limit=10`)
        .then(res => res.json())
        .then(returnedData => {
          if (returnedData.payload !== null) {
            setEvents(returnedData.payload);
          }
        })

      fetch(`${env.API_URL}api/events/status`)
        .then(res => res.json())
        .then(returnedData => {
          if (returnedData.payload.value !== null) {
            setPiOnlineStatus(returnedData.payload.piStatus.value === "TRUE" ? "ONLINE" : "OFFLINE");
            setArmedStatus(returnedData.payload.armedStatus.value === "ARM" ? "ARMED" : "DISARMED")
          }

        })
      fetch(`${env.API_URL}api/recent-faces?offset=0&limit=10`)
        .then(res => res.json())
        .then(returnedData => {
          if (returnedData.payload !== null) {
            setRecentFaces(returnedData.payload)
          }

        })
    }, 5000);

    //Events
    fetch(`${env.API_URL}api/events?offset=0&limit=10`)
      .then(res => res.json())
      .then(returnedData => {
        if (returnedData.payload !== null) {
          setEvents(returnedData.payload);
        }
      })

    //Status
    fetch(`${env.API_URL}api/events/status`)
      .then(res => res.json())
      .then(returnedData => {
        if (returnedData.payload.value !== null) {
          setPiOnlineStatus(returnedData.payload.value === "TRUE" ? "ONLINE" : "OFFLINE");
          setArmedStatus(returnedData.payload.armedStatus.value === "ARM" ? "ARMED" : "DISARMED")
        }

      })
    //Recent faces
    fetch(`${env.API_URL}api/recent-faces?offset=0&limit=10`)
      .then(res => res.json())
      .then(returnedData => {
        if (returnedData.payload !== null) {
          setRecentFaces(returnedData.payload)
        }

      })

    return () => clearInterval(interval);
  }, []);

  const sendArmRequest = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ arm: true })
    };
    fetch(env.FILE_API_URL + "/api/arm-home", requestOptions)
      .then(response => response.json())
      .then(data => { });
  }

  const sendDisarmRequest = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ arm: true })
    };
    fetch(env.FILE_API_URL + "/api/disarm-home", requestOptions)
      .then(response => response.json())
      .then(data => { });
  }

  const handlePopupShow = () => setShowImagePopup(true);
  const handlePopupHide = () => setShowImagePopup(false);

  const formatEvent = (event) => {
    switch (event.type) {
      case "ARM_SYSTEM":
        return event.value === "ARM" ? "System has been armed" : "System has been disarmed"
      case "PI_ONLINE":
        return event.value === "TRUE" ? "Pi is online" : "Pi is now offline"
      case "DETECTED_FACE":
        return "Face detected"
      default:
        break;
    }
  }

  return (
    <div className="app">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">Home Securiteeeee</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Navbar>
      <Container className="mt-4">
        <Row>
          <Col>
            <h5><b>{piOnlineStatus === "ONLINE" ? "Live camera feed (Updates every 5 seconds)" : "Last image from Pi"}</b></h5>
            <div className="card">
              <Image src={camFeedURL} fluid/>
            </div>
            <h5 className="mt-4"><b>Events (last 10)</b></h5>
            <div className="card">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Event Detail</th>
                    <th>View Image</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr>
                      <td>{new Date(event.timestamp).toLocaleString()}</td>
                      <td>{formatEvent(event)}</td>
                      <td>{event.image && <Button onClick={() => { setPopupImageUrl(event.image); handlePopupShow() }}>View</Button>}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col className="mt-4">
            <div>
              <p>Pi Status: <span className={piOnlineStatus == "ONLINE" ? "font-weight-bold text-success" : "font-weight-bold text-danger"}>{piOnlineStatus}</span></p>
              <p>System Status: <span className={armedStatus == "ARMED" ? "font-weight-bold text-success" : "font-weight-bold text-danger"}>{armedStatus}</span></p>
            </div>
            <h5 className="mt-4"><b>Available Actions</b></h5>
            <div className="text-center card">
              <div className="d-flex justify-content-around">
                {armedStatus == "ARMED" ? 
                <Button onClick={sendDisarmRequest}>Disarm</Button> : 
                <Button onClick={sendArmRequest}>Arm</Button>}
              </div>
            </div>
            <h5 className="mt-4"><b>Last 10 face detections</b></h5>
            <div className="d-flex flex-direction-row flex-wrap">
              {recentfaces.map(face => (
                <Card className="d-flex">
                  <img src={face} alt="detected face" width={155} height={155} className="d-flex"/>
                </Card>
              ))}
              {/* <Table>
                <tbody>
                  {recentfaces.map(face => (
                    <tr>
                      <td><img src={face} alt="detected face" width={250} height={250}/></td>
                    </tr>
                  ))}
                </tbody>
              </Table> */}
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={showImagePopup} onHide={handlePopupHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detected Face</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image classname="w-100" src={popupImageURL} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePopupHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  );
}

export default App;
