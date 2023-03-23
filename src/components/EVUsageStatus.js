import "./EVUsageStatus.css";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Form, Dropdown } from "react-bootstrap";
import { StatusIndicator } from "evergreen-ui";
import { timeFormat } from "d3-time-format";

const parseWeekNumber = timeFormat("%U");
const parseMonthNumber = timeFormat("%m");

function EVUsageStatus(props) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(generateSampleData());
  const svgRef = useRef();

  const timeItems = ["Daily", "Weekly", "Monthly"];
  const vehicleItems = ["Audi", "Chevrolet", "Toyota", "Ford", "Tesla"];

  const filteredTimeItems = timeItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVehicleItems = vehicleItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function generateSampleData() {
    // Generate a range of dates for the past month
    const dates = d3.timeDays(d3.timeMonth.floor(new Date()), new Date());

    // Generate random battery usage values for each date
    const usage = dates.map((date) => ({
      date: date.toISOString().slice(0, 10),
      usage: Math.floor(Math.random() * 100),
    }));

    return { usage };
  }

  // Set the dimensions and margins of the chart
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  function drawChart(selectedItem) {
    if (!data) return;

    // Clear the chart
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Draw the chart using D3.js
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Parse the date/time
    const parseTime = d3.timeParse("%Y-%m-%d");

    // Set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define the line
    const line = d3
      .line()
      .curve(d3.curveMonotoneX) // Add this line
      .x((d) => x(d.date))
      .y((d) => y(d.usage));

    // Format the data
    const usageData = data.usage.map((d) => ({
      date: parseTime(d.date),
      usage: d.usage,
    }));

    // Scale the range of the data
    // Scale the range of the data
    // Scale the range of the data
    x.domain([
      d3.timeDay.offset(
        d3.min(usageData, (d) => d.date),
        -1
      ),
      d3.timeDay.offset(
        d3.max(usageData, (d) => d.date),
        1
      ),
    ]);

    // Scale the range of the data
    y.domain([
      0,
      d3.max(usageData, (d) => d.usage) * 1.05, // Add 5% padding to the y-axis domain
    ]);

    // Add the line
    g.append("path").data([usageData]).attr("class", "line").attr("d", line);

    // Add the x-axis
    let xAxis = d3.axisBottom(x);
    if (selectedItem === "Weekly") {
      xAxis.tickFormat(d3.timeFormat("%U"));
    } else if (selectedItem === "Monthly") {
      xAxis.tickFormat(d3.timeFormat("%b %Y"));
    }
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    // Add the y-axis
    const yAxis = d3.axisLeft(y);
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    // Add x-axis label
    const xAxisLabel =
      selectedItem === "Weekly"
        ? "Week Number"
        : selectedItem === "Monthly"
        ? "Month"
        : "Date";
    svg
      .append("text")
      .attr(
        "transform",
        `translate(${width / 2 + margin.left}, ${height + margin.top + 20})`
      )
      .style("text-anchor", "middle")
      .text(xAxisLabel);

    // Add y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 50)
      .attr("x", -(height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Usage");
  }

  useEffect(() => {
    // Set sample data for D3.js chart
    setData(generateSampleData());
  }, []);

  useEffect(() => {
    drawChart(selectedItem);
  }, [data, selectedItem]);

  const handleSelect = (eventKey) => {
    // Handle selection of daily, weekly, or monthly view
    setSelectedItem(eventKey);

    // Modify the chart data based on the selected view
    if (eventKey === "Weekly") {
      // Filter data to only include past month
      const pastMonth = d3.timeDays(d3.timeMonth.floor(new Date()), new Date());
      const weeklyUsage = pastMonth.reduce((acc, date) => {
        // Group usage by week
        const weekNumber = d3.timeFormat("%U")(date);
        acc[weekNumber] = acc[weekNumber] || { date: date, usage: [] };
        acc[weekNumber].usage.push(Math.floor(Math.random() * 100));
        return acc;
      }, {});
      const usageData = Object.values(weeklyUsage).map((d) => ({
        date: parseWeekNumber(d.date),
        usage: d.usage.reduce((sum, val) => sum + val) / d.usage.length,
      }));
      setData({ usage: usageData });
    } else if (eventKey === "Monthly") {
      // Filter data to only include past year
      const pastYear = d3.timeMonths(d3.timeYear.floor(new Date()), new Date());
      const monthlyUsage = pastYear.reduce((acc, date) => {
        // Group usage by month
        const monthNumber = d3.timeFormat("%m")(date);
        acc[monthNumber] = acc[monthNumber] || { date: date, usage: [] };
        acc[monthNumber].usage.push(Math.floor(Math.random() * 100));
        return acc;
      }, {});
      const usageData = Object.values(monthlyUsage).map((d) => ({
        date: parseMonthNumber(d.date),
        usage: d.usage.reduce((sum, val) => sum + val) / d.usage.length,
      }));
      setData({ usage: usageData });
    } else {
      // Use daily sample data
      setData(generateSampleData());
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <div>
      <Form.Group>
        <Form.Label>Select a vehicle:</Form.Label>
        <Dropdown onSelect={handleSelectVehicle}>
          <Dropdown.Toggle style={{ minWidth: "800px" }}>
            {selectedVehicle || "Select Vehicle"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {filteredVehicleItems.map((item, index) => (
              <Dropdown.Item key={index} eventKey={item}>
                {item}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Form.Label>Select a view:</Form.Label>
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle style={{ minWidth: "500px" }}>
            {selectedItem || "Select View"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {filteredTimeItems.map((item, index) => (
              <Dropdown.Item key={index} eventKey={item}>
                {item}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>
      <div
        style={{
          justifyContent: "space-around",
          marginTop: 16,
        }}
      >
        <StatusIndicator color="success" />
        <span style={{ marginRight: 8 }}>Success</span>
        <StatusIndicator color="warning" />{" "}
        <span style={{ marginRight: 8 }}>Warning</span>
        <StatusIndicator color="danger" />{" "}
        <span style={{ marginRight: 8 }}>Yikes!</span>
      </div>
      <div className="chart-frame">
        <div className="chart-container">
          <svg
            ref={svgRef}
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
          ></svg>
        </div>
      </div>
    </div>
  );
}

export default EVUsageStatus;
