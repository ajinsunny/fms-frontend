import React, { useState } from "react";
import { Form, Dropdown } from "react-bootstrap";

function FleetFeed(props) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const items = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 8",
    "Item 9",
    "Item 10",
    "Item 11",
    "Item 12",
    "Item 13",
    "Item 14",
    "Item 15",
    "Item 16",
    "Item 17",
    "Item 18",
    "Item 19",
    "Item 20",
  ];

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <Form.Group>
        <Form.Label>Select an item:</Form.Label>
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle>{selectedItem || "Select Item"}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {filteredItems.map((item, index) => (
              <Dropdown.Item key={index} eventKey={item}>
                {item}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>
    </div>
  );
}

export default FleetFeed;
