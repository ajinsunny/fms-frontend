import "./EVUsageStatus.css";
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import * as d3 from "d3";
import { select } from "d3-selection";

import data from "../vehicleData/vehicleData.json";

import { Form, Card } from "react-bootstrap";
import { StatusIndicator } from "evergreen-ui";
import { timeFormat } from "d3-time-format";

function EVUsageStatus(props) {
  const [selectedItem, setSelectedItem] = useState("Daily");

  // const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [jsonData, setJsonData] = useState();

  const svgRef = useRef();
  const svgRef2 = useRef();

  const timeItems = [
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
  ];

  useEffect(() => {
    setJsonData(data);
  }, []);

  // const vehicleItems = [
  //   { value: "Audi", label: "Audi" },
  //   { value: "Chevrolet", label: "Chevrolet" },
  //   { value: "Toyota", label: "Toyota" },
  //   { value: "Ford", label: "Ford" },
  //   { value: "Tesla", label: "Tesla" },
  // ];

  function CardInfo({
    estimatedRange,
    timeUntilRecharge,
    pingTime,
    chargeErrors,
  }) {
    return (
      <div className="card-info">
        <div className="card-item">
          <h6>Estimated Range: {estimatedRange} miles</h6>
        </div>
        <div className="card-item">
          <h6>Time Until Recharge: {timeUntilRecharge} minutes</h6>
        </div>
        <div className="card-item">
          <h6>Ping Time: {pingTime} ms</h6>
        </div>
        <div className="card-item">
          <h6>Charge Errors Message: {chargeErrors}</h6>
        </div>
      </div>
    );
  }

  function filterData(view) {
    if (view === "Daily") {
      return jsonData.daily_battery_usage.map((d) => ({
        ...d,
        xValue: d.time,
      }));
    } else if (view === "Weekly") {
      return jsonData.weekly_battery_usage.map((d) => ({
        ...d,
        xValue: d.day,
      }));
    } else if (view === "Monthly") {
      return jsonData.monthly_battery_usage.map((d) => ({
        ...d,
        xValue: d.month,
      }));
    }
  }

  function drawChart1(data, svg, width, height, margin) {
    if (!data) {
      return;
    }

    const x = d3
      .scalePoint()
      .range([margin.left, width - margin.right])
      .domain(data.map((d) => d.time))
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, 100]);

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("class", "x-axis-tick-label");

    const yAxis = (g) =>
      g.attr("transform", `translate(${margin.left},0)`).call(
        d3
          .axisLeft(y)
          .ticks(height / 80)
          .tickSizeOuter(0)
      );

    const line = d3
      .line()
      .x((d) => x(d.time))
      .y((d) => y(d.percentage));

    // Add the x-axis and y-axis groups to the SVG element
    const xAxisGroup = d3.select(svg).append("g").attr("class", "x-axis");
    const yAxisGroup = d3.select(svg).append("g").attr("class", "y-axis");

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // Add the line path to the SVG element
    const path = d3.select(svg).append("path").attr("class", "line-path");

    path
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Add the points to the SVG element
    const points = d3.select(svg).selectAll(".data-point").data(data);

    points
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .merge(points)
      .attr("cx", (d) => x(d.time))
      .attr("cy", (d) => y(d.percentage))
      .attr("r", 3)
      .attr("fill", "steelblue");

    points.exit().remove();
  }

  function drawChart2(data, svg, width, height, margin) {
    if (!data) {
      return;
    }

    const x = d3
      .scalePoint()
      .range([margin.left, width - margin.right])
      .domain(data.map((d) => d.xValue))
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, 100]);

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("class", "x-axis-tick-label");

    const yAxis = (g) =>
      g.attr("transform", `translate(${margin.left},0)`).call(
        d3
          .axisLeft(y)
          .ticks(height / 80)
          .tickSizeOuter(0)
      );

    const line = d3
      .line()
      .x((d) => x(d.xValue))
      .y((d) => y(d.percentage));

    d3.select(svg).select(".x-axis").call(xAxis);
    d3.select(svg).select(".y-axis").call(yAxis);

    const path = d3.select(svg).select(".line-path");
    path
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    const points = d3.select(svg).selectAll(".data-point").data(data);

    points
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .merge(points)
      .attr("cx", (d) => x(d.xValue))
      .attr("cy", (d) => y(d.percentage))
      .attr("r", 3)
      .attr("fill", "steelblue");

    points.exit().remove();
  }

  useEffect(() => {
    if (jsonData) {
      drawChart1(
        jsonData.five_hour_usage,
        svgRef.current,
        width,
        height,
        margin
      );
    }
  }, [jsonData]);

  useEffect(() => {
    if (jsonData) {
      const filteredData = filterData(selectedItem);
      drawChart2(filteredData, svgRef2.current, width2, height2, margin);
    }
  }, [jsonData, selectedItem]);

  // Set the dimensions and margins of the chart
  const margin = { top: 10, right: 10, bottom: 20, left: 30 };
  const width = 450 - margin.left - margin.right;
  const width2 = 800 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;
  const height2 = 200 - margin.top - margin.bottom;

  const handleSelect = (selectedOption) => {
    setSelectedItem(selectedOption.value);
  };

  // const handleSelectVehicle = (selectedOption) => {
  //   setSelectedVehicle(selectedOption.value);
  // };

  return (
    <div>
      <Form.Group>
        <Card.Title>EV Usage Status</Card.Title>
        <div className="select-container">
          {/* <div onClick={(e) => e.stopPropagation()}>
            <Select
              value={vehicleItems.find(
                (option) => option.value === selectedVehicle
              )}
              options={vehicleItems}
              onChange={handleSelectVehicle}
              className="basic-single vehicle-select"
              classNamePrefix="select"
              placeholder="Select Vehicle"
            />
          </div> */}

          <div onClick={(e) => e.stopPropagation()}>
            <Select
              value={timeItems.find((option) => option.value === selectedItem)}
              options={timeItems}
              onChange={handleSelect}
              className="basic-single view-select"
              classNamePrefix="select"
              defaultValue={timeItems[0]}
              placeholder="Select View"
            />
          </div>
        </div>
      </Form.Group>
      <div
        style={{
          justifyContent: "space-around",
          marginTop: 16,
        }}
      >
        <StatusIndicator color="success" />
        <span style={{ marginRight: 8 }}>Vehicle Status</span>
        <StatusIndicator color="danger" />{" "}
        <span style={{ marginLeft: 8 }}>Network Status</span>
      </div>
      <div className="chart-frame">
        <div className="chart-container">
          <p>Usage 5 hours ago</p>
          <svg
            ref={svgRef}
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
          ></svg>
        </div>
        <CardInfo
          estimatedRange={200}
          timeUntilRecharge={30}
          pingTime={100}
          chargeErrors="No errors"
        />
      </div>

      <div className="chart-frame">
        <div className="chart-container">
          <p>Daily | Weekly | Monthly</p>
          <svg
            ref={svgRef2}
            width={width2 + margin.left + margin.right}
            height={height2 + margin.top + margin.bottom}
          >
            <g className="x-axis" />
            <g className="y-axis" />
            <path className="line-path" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default EVUsageStatus;
