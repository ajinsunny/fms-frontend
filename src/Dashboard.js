import React, { useState } from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import EVUsageStatus from "./EVUsageStatus";
import EVSystemHealth from "./EVSystemHealth";
import MaintanenceBehavior from "./MaintanenceBehavior";
// import RouteOptimization from "./RouteOptimization";
// import OperationsComms from "./OperationsComms";
// import FleetFeed from "./FleetFeed";

function Dashboard() {
  const [showEVUsageStatus, setShowEVUsageStatus] = useState(false);
  const [showEVSystemHealth, setShowEVSystemHealth] = useState(false);
  const [showMaintanenceBehavior, setShowMaintanenceBehavior] = useState(false);
  // const [showRouteOptimization, setShowRouteOptimization] = useState(false);
  // const [showOperationsComms, setShowOperationsComms] = useState(false);
  // const [showFleetFeed, setShowFleetFeed] = useState(false);

  const handleCloseEVUsageStatus = () => setShowEVUsageStatus(false);
  const handleCloseEVSystemHealth = () => setShowEVSystemHealth(false);
  const handleCloseMaintanenceBehavior = () =>
    setShowMaintanenceBehavior(false);
  // const handleCloseRouteOptimization = () => setShowRouteOptimization(false);
  // const handleCloseOperationsComms = () => setShowOperationsComms(false);
  // const handleCloseFleetFeed = () => setShowFleetFeed(false);

  const handleShowEVUsageStatus = () => setShowEVUsageStatus(true);
  const handleShowEVSystemHealth = () => setShowEVSystemHealth(true);
  const handleShowMaintanenceBehavior = () => setShowMaintanenceBehavior(true);
  // const handleShowRouteOptimization = () => setShowRouteOptimization(true);
  // const handleShowOperationsComms = () => setShowOperationsComms(true);
  // const handleShowFleetFeed = () => setShowFleetFeed(true);

  return (
    <div>
      <h1>
        Good morning, Ajin! ☀️
        <br />
        Your fleets are looking good!
      </h1>

      <Row className="align-items-center">
        <Col>
          <Button variant="primary" onClick={() => handleShowEVUsageStatus()}>
            EV Usage
          </Button>
          <AnimatePresence>
            {showEVUsageStatus && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0.1, scaleY: 0.1 }}
                animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleX: 0.1, scaleY: 0.1 }}
                transition={{ duration: 0.5 }}
                style={{ position: "absolute", top: 40, left: 20 }}
              >
                <EVUsageStatus />
              </motion.div>
            )}
          </AnimatePresence>
        </Col>
        <Col>
          <Button variant="primary" onClick={() => handleShowEVSystemHealth()}>
            EVSystemHealth
          </Button>
          <AnimatePresence>
            {showEVSystemHealth && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Modal
                  show={showEVSystemHealth}
                  onHide={() => setShowEVSystemHealth(false)}
                  centered={true}
                  size="xl"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>EV System Health</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EVSystemHealth />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => handleCloseEVSystemHealth()}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </motion.div>
            )}
          </AnimatePresence>
        </Col>
        <Col>
          <Button
            variant="primary"
            onClick={() => handleShowMaintanenceBehavior()}
          >
            Maintanence Behavior
          </Button>
          <AnimatePresence>
            {showMaintanenceBehavior && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Modal
                  show={showMaintanenceBehavior}
                  onHide={() => setShowMaintanenceBehavior(false)}
                  centered={true}
                  size="xl"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Maintanence Behavior</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EVSystemHealth />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => handleCloseMaintanenceBehavior()}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </motion.div>
            )}
          </AnimatePresence>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
