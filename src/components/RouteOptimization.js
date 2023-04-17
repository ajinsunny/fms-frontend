// RouteOptimization.js
import React from "react";
import { Card } from "react-bootstrap";
import routeOptimizationImage from "./img/routeoptimization.png"; // Import the image you want to use
import "./RouteOptimization.css";

function RouteOptimization(props) {
  return (
    <div className="card-content">
      <Card className="route-optimization-card">
        <Card.Body className="route-optimization-card-body">
          <div className="route-optimization-content">
            <Card.Title>Route Optimization</Card.Title>
            <Card.Title>Module Build in Progress</Card.Title>
            <Card.Img
              className="route-optimization-img"
              src={routeOptimizationImage}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RouteOptimization;
