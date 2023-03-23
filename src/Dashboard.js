import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import EVUsageStatus from "./components/EVUsageStatus";
import EVSystemHealth from "./components/EVSystemHealth";
import MaintanenceBehavior from "./components/MaintanenceBehavior";
import RouteOptimization from "./components/RouteOptimization";
import OperationsComms from "./components/OperationsComms";
import FleetFeed from "./components/FleetFeed";

function Dashboard() {
  const [showEVUsageStatus, setShowEVUsageStatus] = useState(false);
  const [showEVSystemHealth, setShowEVSystemHealth] = useState(false);
  const [showMaintanenceBehavior, setShowMaintanenceBehavior] = useState(false);
  const [showRouteOptimization, setShowRouteOptimization] = useState(false);
  const [showOperationsComms, setShowOperationsComms] = useState(false);
  const [showFleetFeed, setShowFleetFeed] = useState(false);

  const evUsageStatusRef = useRef(null);
  const evSystemHealthRef = useRef(null);
  const maintanenceBehaviorRef = useRef(null);
  const routeOptimizationRef = useRef(null);
  const fleetFeedRef = useRef(null);
  const operationsCommsRef = useRef(null);

  useEffect(() => {
    // Attach event listener to document
    document.addEventListener("click", handleClickOutside);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleCloseEVUsageStatus = () => setShowEVUsageStatus(false);
  const handleCloseEVSystemHealth = () => setShowEVSystemHealth(false);
  const handleCloseMaintanenceBehavior = () =>
    setShowMaintanenceBehavior(false);
  const handleCloseRouteOptimization = () => setShowRouteOptimization(false);
  const handleCloseOperationsComms = () => setShowOperationsComms(false);
  const handleCloseFleetFeed = () => setShowFleetFeed(false);

  const handleClickOutside = (e) => {
    if (
      evUsageStatusRef.current &&
      !evUsageStatusRef.current.contains(e.target) &&
      !e.target.classList.contains("ev-usage-status-btn")
    ) {
      handleCloseEVUsageStatus();
    }

    if (
      evSystemHealthRef.current &&
      !evSystemHealthRef.current.contains(e.target) &&
      !e.target.classList.contains("ev-system-health-btn")
    ) {
      handleCloseEVSystemHealth();
    }

    if (
      maintanenceBehaviorRef.current &&
      !maintanenceBehaviorRef.current.contains(e.target) &&
      !e.target.classList.contains("maintanence-behavior-btn")
    ) {
      handleCloseMaintanenceBehavior();
    }

    if (
      routeOptimizationRef.current &&
      !routeOptimizationRef.current.contains(e.target) &&
      !e.target.classList.contains("route-optimization-btn")
    ) {
      handleCloseRouteOptimization();
    }

    if (
      fleetFeedRef.current &&
      !fleetFeedRef.current.contains(e.target) &&
      !e.target.classList.contains("fleet-feed-btn")
    ) {
      handleCloseFleetFeed();
    }

    if (
      operationsCommsRef.current &&
      !operationsCommsRef.current.contains(e.target) &&
      !e.target.classList.contains("operations-comms-btn")
    ) {
      handleCloseOperationsComms();
    }
  };

  const handleShowEVUsageStatus = () => setShowEVUsageStatus(true);
  const handleShowEVSystemHealth = () => setShowEVSystemHealth(true);
  const handleShowMaintanenceBehavior = () => setShowMaintanenceBehavior(true);
  const handleShowRouteOptimization = () => setShowRouteOptimization(true);
  const handleShowOperationsComms = () => setShowOperationsComms(true);
  const handleShowFleetFeed = () => setShowFleetFeed(true);

  return (
    <div>
      <h1>
        Good morning, Ajin! ☀️
        <br />
        Your fleets are looking good!
      </h1>

      <Row className="align-items-center" style={{ paddingBlock: "100px" }}>
        <Col>
          <AnimatePresence>
            {showEVUsageStatus && (
              <motion.div
                key="evUsageStatus"
                ref={evUsageStatusRef}
                initial={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                animate={{
                  scaleX: 1,
                  scaleY: 1,
                  opacity: 1,
                  transformOrigin: "top left",
                }}
                exit={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  backgroundColor: "white",
                  borderRadius: 5,
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
                  padding: 20,
                }}
              >
                <EVUsageStatus />
              </motion.div>
            )}
            {!showEVUsageStatus && (
              <Button
                variant="primary"
                onClick={handleShowEVUsageStatus}
                className="ev-usage-status-btn"
              >
                EV Usage
              </Button>
            )}
          </AnimatePresence>
        </Col>
        <Col>
          <AnimatePresence>
            {showEVSystemHealth && (
              <motion.div
                key="evSystemHealth"
                ref={evSystemHealthRef}
                initial={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                animate={{
                  scaleX: 1,
                  scaleY: 1,
                  opacity: 1,
                  transformOrigin: "top left",
                }}
                exit={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  backgroundColor: "white",
                  borderRadius: 5,
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
                  padding: 20,
                }}
              >
                <EVSystemHealth />
              </motion.div>
            )}
          </AnimatePresence>
          {!showEVSystemHealth && (
            <Button
              variant="primary"
              onClick={handleShowEVSystemHealth}
              className="ev-system-health-btn"
            >
              EV System Health
            </Button>
          )}
        </Col>
        <Col>
          <AnimatePresence>
            {showMaintanenceBehavior && (
              <motion.div
                key="evMaintanenceBehavior"
                ref={maintanenceBehaviorRef}
                initial={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                animate={{
                  scaleX: 1,
                  scaleY: 1,
                  opacity: 1,
                  transformOrigin: "top left",
                }}
                exit={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  backgroundColor: "white",
                  borderRadius: 5,
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
                  padding: 20,
                }}
              >
                <MaintanenceBehavior />
              </motion.div>
            )}
          </AnimatePresence>
          {!showMaintanenceBehavior && (
            <Button
              variant="primary"
              onClick={handleShowMaintanenceBehavior}
              className="maintanence-behavior-btn"
            >
              Maintanence Behavior
            </Button>
          )}
        </Col>
      </Row>

      <Row className="align-items-center" style={{ paddingBlock: "100px" }}>
        <Col>
          <AnimatePresence>
            {showRouteOptimization && (
              <motion.div
                key="evRouteOptimization"
                ref={routeOptimizationRef}
                initial={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                animate={{
                  scaleX: 1,
                  scaleY: 1,
                  opacity: 1,
                  transformOrigin: "top left",
                }}
                exit={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  backgroundColor: "white",
                  borderRadius: 5,
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
                  padding: 20,
                }}
              >
                <RouteOptimization />
              </motion.div>
            )}
          </AnimatePresence>
          {!showMaintanenceBehavior && (
            <Button
              variant="primary"
              onClick={handleShowRouteOptimization}
              className="route-optimization-btn"
            >
              Route Optimization
            </Button>
          )}
        </Col>
        <Col>
          <AnimatePresence>
            {showFleetFeed && (
              <motion.div
                key="evFleetFeed"
                ref={fleetFeedRef}
                initial={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                animate={{
                  scaleX: 1,
                  scaleY: 1,
                  opacity: 1,
                  transformOrigin: "top left",
                }}
                exit={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  backgroundColor: "white",
                  borderRadius: 5,
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
                  padding: 20,
                }}
              >
                <FleetFeed />
              </motion.div>
            )}
          </AnimatePresence>
          {!showMaintanenceBehavior && (
            <Button
              variant="primary"
              onClick={handleShowFleetFeed}
              className="fleet-feed-btn"
            >
              Fleet Feed
            </Button>
          )}
        </Col>

        <Col>
          <AnimatePresence>
            {showOperationsComms && (
              <motion.div
                key="evOperationsComms"
                ref={operationsCommsRef}
                initial={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                animate={{
                  scaleX: 1,
                  scaleY: 1,
                  opacity: 1,
                  transformOrigin: "top left",
                }}
                exit={{
                  scaleX: 0,
                  scaleY: 0,
                  opacity: 0,
                  transformOrigin: "top left",
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  backgroundColor: "white",
                  borderRadius: 5,
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
                  padding: 20,
                }}
              >
                <OperationsComms />
              </motion.div>
            )}
          </AnimatePresence>
          {!showOperationsComms && (
            <Button
              variant="primary"
              onClick={handleShowOperationsComms}
              className="operations-comms-btn"
            >
              Operations Comms
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
