import React from "react";
import { Card } from "react-bootstrap";
import evSystemHealthImage from './img/evsystemhealth.png';
import './EVSystemHealth.css';

function EVSystemHealth(props) {
  return (
    <div className="card-content">
      <Card className="ev-system-health-card">
        <Card.Body className="ev-system-health-card-body">
          <div className="ev-system-health-content">
            <Card.Title>EV System Health</Card.Title>
            <Card.Title>Module Build in Progress</Card.Title>
            <Card.Img className="ev-system-health-img" src={evSystemHealthImage} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default EVSystemHealth;
