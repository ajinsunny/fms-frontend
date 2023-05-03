import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { Container, Row, Col, Card } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "react-sidebar";
import html2canvas from "html2canvas";

import EVUsageStatus from "./components/EVUsageStatus";
import EVSystemHealth from "./components/EVSystemHealth";
import MaintanenceBehavior from "./components/MaintanenceBehavior";
import RouteOptimization from "./components/RouteOptimization";
import OperationsComms from "./components/OperationsComms";
import FleetFeed from "./components/FleetFeed";
import WeatherCard from "./components/WeatherCard";

function Dashboard({ user }) {
  // State variables
  const [selectedCard, setSelectedCard] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [greetingPhrase, setGreetingPhrase] = useState("");
  const [emoji, setEmoji] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [snapshots, setSnapshots] = useState({});

  // Array of greetings to be displayed
  const greetings = [
    "Fleets achieving top performance!",
    "Your fleets are looking good!",
    "Your fleets are thriving!",
    "Fleets driving to excellence!",
    "Remarkable fleet progress!",
    "Efficient fleets, smooth rides!",
    "Fleets navigating with ease!",
    "Mastery in fleet management!",
    "Fleets cruising to success!",
    "Your fleets are unstoppable!",
    "Fleets conquering the roads!",
  ];
  
  // Function to get a random greeting from the greetings array
  const getRandomGreeting = () => {
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  // Reference to the expanded card element
  const expandedCardRef = useRef(null);

  // Function to toggle the sidebar open/closed state
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to capture a snapshot of the card when clicked
  const takeSnapshot = async (cardId) => {
    const cardElement = document.querySelector(`#card-${cardId}`);
    const expandedCardElement = document.querySelector(".expanded-card");

    if (expandedCardElement) {
      const canvas = await html2canvas(expandedCardElement);
      const snapshot = canvas.toDataURL();
      setSnapshots((prevState) => ({ ...prevState, [cardId]: snapshot }));
    }
  };

  // Animation settings for the text elements
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

  // Function to render the content for a card based on its ID
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

  // Set up event listeners, state updates, and cleanup when component mounts or updates
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    let newGreeting = "";
    let newEmoji = "";

    const randomGreeting = getRandomGreeting();
    setGreetingPhrase(randomGreeting);

    if (currentHour >= 5 && currentHour < 12) {
      newGreeting = "Good morning";
      newEmoji = " 🌅";
    } else if (currentHour >= 12 && currentHour < 18) {
      newGreeting = "Good afternoon";
      newEmoji = " 🌤️";
    } else {
      newGreeting = "Good evening";
      newEmoji = " 🌙";
    }

    if (user) {
      newGreeting = `${newGreeting}, ${user}!`;
    } else {
      newGreeting = `${newGreeting}!`;
    }

    setGreeting(newGreeting);
    setEmoji(newEmoji);
    const handleClickOutside = (event) => {
      if (
        selectedCard &&
        event.target.closest(".expanded-card") === null &&
        !expandedCardRef.current.contains(event.target)
      ) {
        takeSnapshot(selectedCard);
        setSelectedCard(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedCard, user]);

  // Array of card items with their respective IDs and titles
  const cardItems = [
    { id: "evUsage", title: "EV Usage" },
    { id: "evSystemHealth", title: "EV System Health" },
    { id: "maintanenceBehavior", title: "Maintenance Behavior" },
    { id: "routeOptimization", title: "Route Optimization" },
    { id: "fleetFeed", title: "Fleet Feed" },
    { id: "operationsComms", title: "Operations Comms" },
  ];

  // Return the Dashboard component JSX
  return (
    <div>
    {/* Render the Sidebar component with custom styles and menu items */}
      <Sidebar
        sidebar={
          <div className="sidebar-menu">
            <ul>
              <li>
                <h3>Dashboard</h3>
              </li>
              <li>
                <h3>System Docs</h3>
              </li>
              <li>
                <h3>Settings</h3>
              </li>
            </ul>
          </div>
        }
        open={sidebarOpen} // Set the open state of the sidebar
        onSetOpen={toggleSidebar}// Function to toggle the sidebar open state
        styles={{
                // Custom styles for the sidebar, overlay, and content
          sidebar: {
            background: "#292929",
            padding: "4rem",
            width: "400px",
          },
          overlay: {
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          },
          content: {
            position: "relative",
            overflow: "hidden",
          },
        }}
      >
        {/* Hamburger menu icon to toggle sidebar open state */}
        <div className="hamburger-menu" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </Sidebar>
      <div className="header-container">
        {/* WeatherCard component */}
        <WeatherCard />
        <h1 className="header-text">
          {/* Display the greeting text with animations */}
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
          {/* Display the emoji with animations */}
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
          {/* Display the greetingPhrase with animations */}
          <motion.span
            key={greeting.length + emoji.length}
            variants={text}
            initial="hidden"
            animate="visible"
            transition={{
              delay: greeting.length * 0.001 + emoji.length * 0.001 + 0.5,
              duration: 0.5,
            }}
          >
            {greetingPhrase}
          </motion.span>
        </h1>
        <div style={{ flexGrow: 1 }} />
      </div>{" "}
      {/* Container with rows and columns for displaying card items */}
      <Container fluid>
        <Row
          className="align-items-center gx-2 gy-2"
          // style={{ paddingBlock: "50px" }}
        >
          {cardItems.slice(0, 3).map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={4} xl={4}>
              <Card
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedCard === item.id) {
                    takeSnapshot(item.id);
                  }
                  setSelectedCard(item.id === selectedCard ? null : item.id);
                }}
              >
                <motion.div layoutId={`card-${item.id}`}>
                {/* If a snapshot is available, display it /}
                  {snapshots[item.id] ? (
                    <Card.Img
                      className="card-snapshot"
                      variant="top"
                      src={snapshots[item.id]}
                      style={{
                        objectFit: "contain",
                        height: "300px",
                        width: "400px",
                        backgroundColor: "transparent",
                      }}
                    />
                  ) : (
                    <Card.Body>
                    {/ Otherwise, display the card title */}
                      <Card.Title>{item.title}</Card.Title>
                    </Card.Body>
                  )}
                </motion.div>
              </Card>
            </Col>
          ))}
          {/* Loop through the next 3 card items */}
          {cardItems.slice(3, 6).map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={4} xl={4}>
              <Card
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedCard === item.id) {
                    takeSnapshot(item.id);
                  }
                  setSelectedCard(item.id === selectedCard ? null : item.id);
                }}
              >
                <motion.div layoutId={`card-${item.id}`}>
                  {snapshots[item.id] ? (
                    <Card.Img
                      className="card-snapshot"
                      variant="top"
                      src={snapshots[item.id]}
                      style={{
                        objectFit: "contain",
                        height: "300px",
                        width: "400px",
                      }}
                    />
                  ) : (
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                    </Card.Body>
                  )}
                </motion.div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      {/* Animate the presence of the expanded card /}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            ref={expandedCardRef}
            className="expanded-card"
            layoutId={`card-${selectedCard}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: "10%",
              left: "20%",
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
