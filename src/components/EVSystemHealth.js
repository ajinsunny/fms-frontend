import React from "react";
import { Card } from "react-bootstrap";
import Select from "react-select";
import "./EVSystemHealth.css";

const vehicleParts = [
  {
    value: "part1",
    label: "Part 1",
    imageUrl: "/path/to/image1.jpg",
    logs: Array(50).fill("Log entry for Part 1"),
    usageTrends: Array(50).fill("Usage trend for Part 1"),
  },
  {
    value: "part2",
    label: "Part 2",
    imageUrl: "/path/to/image2.jpg",
    logs: Array(50).fill("Log entry for Part 2"),
    usageTrends: Array(50).fill("Usage trend for Part 2"),
  },
  // ... add more parts
];

function EVSystemHealth(props) {
  const [selectedPart, setSelectedPart] = React.useState(null);

  const handleChange = (selectedOption) => {
    setSelectedPart(selectedOption);
    console.log(`Option selected:`, selectedOption);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: 25,
      borderColor: "#d9d9d9",
      boxShadow: null,
      "&:hover": {
        borderColor: "#b3b3b3",
      },
    }),
  };

  const handleWrapperClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="card-content">
      <Card className="ev-system-health-card">
        <Card.Body className="ev-system-health-card-body">
          <div className="ev-system-health-content">
            <Card.Title>EV System Health</Card.Title>
            <div onClick={handleWrapperClick}>
              <Select
                value={selectedPart}
                onChange={handleChange}
                options={vehicleParts}
                styles={customStyles}
                className="part-select"
              />
            </div>
            {selectedPart && (
              <div className="details-container">
                <div className="preview-and-logs">
                  <div className="part-image-container">
                    <div className="part-image">
                      <img
                        src={selectedPart.imageUrl}
                        alt={selectedPart.label}
                      />
                    </div>
                  </div>
                  <div className="service-logs">
                    <h3>Service Logs for {selectedPart.label}</h3>
                    <ul className="logs-list">
                      {selectedPart.logs.map((log, index) => (
                        <li key={index}>{log}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="usage-trends">
                  <h3>Usage Trends for {selectedPart.label}</h3>
                  <ul className="trends-list">
                    {selectedPart.usageTrends &&
                      selectedPart.usageTrends.map((trend, index) => (
                        <li key={index}>{trend}</li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default EVSystemHealth;
