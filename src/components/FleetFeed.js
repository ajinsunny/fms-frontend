// FleetFeed.js
import React from "react";
import { Card } from "react-bootstrap";
import fleetFeedImage from "./img/fleetfeed.png";
import "./FleetFeed.css";

function FleetFeed() {
  return (
    <div className="card-content">
      <Card className="fleet-feed-card">
        <Card.Body className="fleet-feed-card-body">
          <div className="fleet-feed-content">
            <Card.Title>Fleet Feed</Card.Title>
            <Card.Title>Module Build in Progress</Card.Title>
            <Card.Img className="fleet-feed-img" src={fleetFeedImage} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default FleetFeed;
