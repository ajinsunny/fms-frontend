import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Container, Row, Col, Card } from "react-bootstrap";
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

  const text = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: "rgba(255, 255, 255, 1)",
      strokeDasharray: "1 0",
      strokeDashoffset: "0",
    },
  };

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
      newGreeting = "Good morning, Ajin! ";
      newEmoji = " 🌅";
    } else if (currentHour >= 12 && currentHour < 18) {
      newGreeting = "Good afternoon, Ajin! ";
      newEmoji = " 🌤️";
    } else {
      newGreeting = "Good evening, Ajin!";
      newEmoji = " 🌙";
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
        {greeting.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={text}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.03 + 0.1, duration: 0.01 }}
          >
            {char}
          </motion.span>
        ))}
        {emoji.split("").map((char, index) => (
          <motion.span
            key={greeting.length + index}
            variants={text}
            initial="hidden"
            animate="visible"
            transition={{
              delay: greeting.length * 0.01 + index * 0.01 + 0.5,
              duration: 0.5,
            }}
          >
            {char}
          </motion.span>
        ))}
        <br />
        {"Your fleets are looking good!".split("").map((char, index) => (
          <motion.span
            key={greeting.length + emoji.length + index}
            variants={text}
            initial="hidden"
            animate="visible"
            transition={{
              delay:
                greeting.length * 0.001 +
                emoji.length * 0.001 +
                index * 0.01 +
                0.5,
              duration: 0.5,
            }}
          >
            {char}
          </motion.span>
        ))}
      </h1>{" "}
      <Container fluid>
        <Row className="align-items-center gx-2 gy-2">
          {cardItems.slice(0, 3).map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={4} xl={4}>
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
        <Row
          className="align-items-center gx-2 gy-2" // Add gx-2 gy-2 here
          style={{ paddingBlock: "100px" }}
        >
          {cardItems.slice(3, 6).map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={4} xl={4}>
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
      </Container>
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
              top: "10%",
              left: "10%",
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
