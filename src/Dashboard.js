import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Row, Col, Card } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import EVUsageStatus from "./components/EVUsageStatus";
import EVSystemHealth from "./components/EVSystemHealth";
import MaintanenceBehavior from "./components/MaintanenceBehavior";
import RouteOptimization from "./components/RouteOptimization";
import OperationsComms from "./components/OperationsComms";
import FleetFeed from "./components/FleetFeed";

function Dashboard() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");

  const renderCardContent = () => {
    switch (selectedCard) {
      case "evUsage":
        return <EVUsageStatus />;
      case "evSystemHealth":
        return <EVSystemHealth />;
      case "maintanenceBehavior":
        return <MaintanenceBehavior />;
      case "routeOptimization":
        return <RouteOptimization />;
      case "fleetFeed":
        return <FleetFeed />;
      case "operationsComms":
        return <OperationsComms />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    let newGreeting = "";
    let newEmoji = "";

    if (currentHour >= 5 && currentHour < 12) {
      newGreeting = "Good morning";
      newEmoji = "🌅";
    } else if (currentHour >= 12 && currentHour < 18) {
      newGreeting = "Good afternoon";
      newEmoji = "🌤️";
    } else {
      newGreeting = "Good evening";
      newEmoji = "🌙";
    }

    setGreeting(newGreeting);
    setEmoji(newEmoji);
    const handleClickOutside = (event) => {
      if (selectedCard && event.target.closest(".expanded-card") === null) {
        setSelectedCard(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedCard]);

  const cardItems = [
    { id: "evUsage", title: "EV Usage" },
    { id: "evSystemHealth", title: "EV System Health" },
    { id: "maintanenceBehavior", title: "Maintanence Behavior" },
    { id: "routeOptimization", title: "Route Optimization" },
    { id: "fleetFeed", title: "Fleet Feed" },
    { id: "operationsComms", title: "Operations Comms" },
  ];

  return (
    <div>
      <h1>
        {greeting}, Ajin! {emoji}
        <br />
        Your fleets are looking good!
      </h1>

      <Row className="align-items-center" style={{ paddingBlock: "100px" }}>
        {cardItems.slice(0, 3).map((item) => (
          <Col key={item.id}>
            <Card>
              <motion.div layoutId={`card-${item.id}`}>
                <Card.Body
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCard(item.id);
                  }}
                >
                  <Card.Title>{item.title}</Card.Title>
                </Card.Body>
              </motion.div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="align-items-center" style={{ paddingBlock: "100px" }}>
        {cardItems.slice(3, 6).map((item) => (
          <Col key={item.id}>
            <Card>
              <motion.div layoutId={`card-${item.id}`}>
                <Card.Body
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCard(item.id);
                  }}
                >
                  <Card.Title>{item.title}</Card.Title>
                </Card.Body>
              </motion.div>
            </Card>
          </Col>
        ))}
      </Row>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="expanded-card"
            layoutId={`card-${selectedCard}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: "30%",
              left: "30%",
              zIndex: 10,
              background: "white",
              padding: "2rem",
              transform: "translate(-50%, -50%)",
            }}
          >
            {renderCardContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;
