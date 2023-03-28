import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import NameInput from "./NameInput";
import Dashboard from "./Dashboard";
import reportWebVitals from "./reportWebVitals";

function App() {
  const [userName, setUserName] = useState(null);

  return (
    <React.StrictMode>
      {!userName ? (
        <NameInput onSetName={setUserName} />
      ) : (
        <Dashboard user={userName} />
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
