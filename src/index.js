import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import NameInput from "./NameInput";
import Dashboard from "./Dashboard";
import reportWebVitals from "./reportWebVitals";
import { motion } from "framer-motion"; // Import motion from framer-motion

function App() {
  const [userName, setUserName] = useState(null);

  return (
    <React.StrictMode>
      {!userName ? (
        <NameInput onSetName={setUserName} />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 10,
              stiffness: 70,
              restDelta: 0.001,
            },
          }}
        >
          <Dashboard user={userName} />
        </motion.div>
      )}
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
