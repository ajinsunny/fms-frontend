import "./EVUsageStatus.css";
import React, { useState, useEffect, useRef } from "react";
import { useCallback } from "react";
import * as d3 from "d3";
import { Form, Dropdown } from "react-bootstrap";
import { StatusIndicator } from "evergreen-ui";
import { timeFormat } from "d3-time-format";

const parseWeekNumber = timeFormat("%U");
const parseMonthNumber = timeFormat("%m");

function EVUsageStatus(props) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState("");
  const [timeSearchTerm, setTimeSearchTerm] = useState("");

  const [data, setData] = useState(generateSampleData());
  const svgRef = useRef();

  const timeItems = ["Daily", "Weekly", "Monthly"];
  const vehicleItems = ["Audi", "Chevrolet", "Toyota", "Ford", "Tesla"];

  const filteredTimeItems = timeItems.filter((item) =>
    item.toLowerCase().includes(timeSearchTerm.toLowerCase())
  );

  const filteredVehicleItems = vehicleItems.filter((item) =>
    item.toLowerCase().includes(vehicleSearchTerm.toLowerCase())
  );

  function generateSampleData() {
    // Generate a range of dates for the entire year
    const dates = d3.timeDays(d3.timeYear.floor(new Date()), new Date());

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

  const drawChart = useCallback(
    (selectedItem) => {
      if (!data) return;

      // Clear the chart
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Draw the chart using D3.js
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
      const filteredData = data.usage
        .map((d) => {
          const date = d3.timeParse("%Y-%m-%d")(d.date);
          return {
            date,
            usage: d.usage,
          };
        })
        .filter((d) => {
          if (selectedItem === "Weekly") {
            const currentDate = new Date();
            const pastMonth = d3.timeMonth.floor(currentDate);
            return d.date >= pastMonth && d.date <= currentDate;
          } else if (selectedItem === "Monthly") {
            const currentDate = new Date();
            const pastYear = d3.timeYear.floor(currentDate);
            return d.date >= pastYear && d.date <= currentDate;
          } else {
            return true;
          }
        });

      const aggregatedUsageData = (() => {
        if (selectedItem === "Daily") {
          return filteredData;
        }

        const aggregatedData = new Map();

        filteredData.forEach((d) => {
          const key =
            selectedItem === "Weekly"
              ? `${d.date.getFullYear()}-${parseWeekNumber(d.date)}`
              : `${d.date.getFullYear()}-${parseMonthNumber(d.date)}`;

          if (aggregatedData.has(key)) {
            const { sum, count } = aggregatedData.get(key);
            aggregatedData.set(key, { sum: sum + d.usage, count: count + 1 });
          } else {
            aggregatedData.set(key, { sum: d.usage, count: 1 });
          }
        });

        return Array.from(aggregatedData.entries()).map(
          ([key, { sum, count }]) => {
            const [year, num] = key.split("-");
            const date =
              selectedItem === "Weekly"
                ? d3.timeWeek.floor(new Date(year, 0, 1)).setDate(num * 7)
                : new Date(year, num - 1);

            return {
              date,
              usage: sum / count,
            };
          }
        );
      })();

      // Scale the range of the data
      x.domain([
        d3.timeDay.offset(
          d3.min(aggregatedUsageData, (d) => d.date),
          -1
        ),
        d3.timeDay.offset(
          d3.max(aggregatedUsageData, (d) => d.date),
          1
        ),
      ]);

      y.domain([
        0,
        d3.max(aggregatedUsageData, (d) => d.usage) * 1.05, // Add 5% padding to the y-axis domain
      ]);

      // Add the line
      g.append("path")
        .data([aggregatedUsageData])
        .attr("class", "line")
        .attr("d", line);

      // Add the x-axis
      let xAxis = d3.axisBottom(x);
      if (selectedItem === "Weekly") {
        xAxis.tickFormat(d3.timeFormat("%U"));
      } else if (selectedItem === "Monthly") {
        xAxis.tickFormat(d3.timeFormat("%b %Y"));
      }
      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      // Add the y-axis
      const yAxis = d3.axisLeft(y);
      g.append("g").attr("class", "y-axis").call(yAxis);

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
    },
    [data]
  );

  useEffect(() => {
    // Set sample data for D3.js chart
    setData(generateSampleData());
  }, []);

  useEffect(() => {
    if (selectedItem) {
      drawChart(selectedItem);
    }
  }, [data, selectedItem, drawChart]);

  const handleSelect = (eventKey) => {
    // Handle selection of daily, weekly, or monthly view
    setSelectedItem(eventKey);
  };

  const handleVehicleSearch = (event) => {
    setVehicleSearchTerm(event.target.value);
  };

  const handleTimeSearch = (event) => {
    setTimeSearchTerm(event.target.value);
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
              value={vehicleSearchTerm}
              onChange={handleVehicleSearch}
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
              value={timeSearchTerm}
              onChange={handleTimeSearch}
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
