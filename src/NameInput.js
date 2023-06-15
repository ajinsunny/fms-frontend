import React, { useState } from "react";
import "./NameInput.css";

function NameInput({ onSetName }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSetName(name);
  };

  return (
    <div className="name-input-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Please enter your name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default NameInput;
