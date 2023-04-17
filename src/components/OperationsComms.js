// OperationsComms.js
import React from "react";
import { Card } from "react-bootstrap";
import operationsCommsImage from "./img/operationscomms.png";
import "./OperationsComms.css";

function OperationsComms(props) {
  return (
    <div className="card-content">
      <Card className="operations-comms-card">
        <Card.Body className="operations-comms-card-body">
          <div className="operations-comms-content">
            <Card.Title>Operations Comms</Card.Title>
            <Card.Title>Module Build in Progress</Card.Title>
            <Card.Img
              className="operations-comms-img"
              src={operationsCommsImage}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default OperationsComms;
