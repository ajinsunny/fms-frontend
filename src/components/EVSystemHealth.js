import React, { useState } from "react";
import { Card } from "react-bootstrap";
import Select from "react-select";
import "./EVSystemHealth.css";

function EVSystemHealth(props) {
  const [selectedPart, setSelectedPart] = useState(null);

  const vehicleParts = [
    {
      value: "part1",
      label: "Vehicle Part 1",
      img: "part1.png",
      pdf: "part1.pdf",
    },
    {
      value: "part2",
      label: "Vehicle Part 2",
      img: "part2.png",
      pdf: "part2.pdf",
    },
  ];

  const openPDF = () => {
    window.open(selectedPart.pdf, "_blank");
  };

  return (
    <div className="card-content">
      <Card className="ev-system-health-card">
        <Card.Body className="ev-system-health-card-body">
          <div className="ev-system-health-content">
            <Card.Title>EV System Health</Card.Title>

            <Select
              options={vehicleParts}
              onChange={setSelectedPart}
              isSearchable
              className="select-component" // Add a class for styling
              placeholder="Search for a vehicle part"
            />

            {selectedPart && (
              <>
                <Card.Img
                  className="ev-system-health-img"
                  src={selectedPart.img}
                />
                <button onClick={openPDF}>Open Documentation</button>
                <h2>Service Log</h2>
                <p>Service 1: Performed on 01/01/2023</p>
                <p>Service 2: Performed on 02/02/2023</p>
                <p>Service 3: Performed on 03/03/2023</p>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default EVSystemHealth;
