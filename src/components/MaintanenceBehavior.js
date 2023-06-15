// MaintenanceBehavior.js
import React from "react";
import { Card } from "react-bootstrap";
import maintenanceBehaviorImage from "./img/maintenanceandbehavior.png"; // Import the image you want to use
import "./MaintenanceBehavior.css";

function MaintenanceBehavior(props) {
  return (
    <div className="card-content">
      <Card className="maintenance-behavior-card">
        <Card.Body className="maintenance-behavior-card-body">
          <div className="maintenance-behavior-content">
            <Card.Title>Maintenance Behavior</Card.Title>
            <Card.Title>Module Build in Progress</Card.Title>
            <Card.Img
              className="maintenance-behavior-img"
              src={maintenanceBehaviorImage}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default MaintenanceBehavior;
