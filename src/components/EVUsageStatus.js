import "./EVUsageStatus.css";
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { useCallback } from "react";
import * as d3 from "d3";
import { Form } from "react-bootstrap";
import { StatusIndicator } from "evergreen-ui";
import { timeFormat } from "d3-time-format";

const parseWeekNumber = timeFormat("%U");
const parseMonthNumber = timeFormat("%m");

function EVUsageStatus(props) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [data, setData] = useState(generateSampleData());
  const svgRef = useRef();
  const svgRef2 = useRef();

  const timeItems = [
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
  ];

  const vehicleItems = [
    { value: "Audi", label: "Audi" },
    { value: "Chevrolet", label: "Chevrolet" },
    { value: "Toyota", label: "Toyota" },
    { value: "Ford", label: "Ford" },
    { value: "Tesla", label: "Tesla" },
  ];

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
  const margin = { top: 10, right: 0, bottom: 50, left: 30 };
  const width = 450 - margin.left - margin.right;
  const width2 = 800 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;
  const height2 = 200 - margin.top - margin.bottom;

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
          `translate(${width / 2 + margin.left}, ${height + margin.top + 40})`
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

      const drawSecondChart = () => {
        // Clear the chart
        const svg2 = d3.select(svgRef2.current);
        svg2.selectAll("*").remove();

        // Draw the chart using D3.js
        const g2 = svg2
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Set the ranges
        const x2 = d3.scaleTime().range([0, width2]);
        const y2 = d3.scaleLinear().range([height2, 0]);

        // Define the line
        const line2 = d3
          .line()
          .curve(d3.curveMonotoneX)
          .x((d) => x2(d.date))
          .y((d) => y2(d.usage));

        // Scale the range of the data
        x2.domain(x.domain());
        y2.domain(y.domain());

        // Add the line
        g2.append("path")
          .data([aggregatedUsageData])
          .attr("class", "line")
          .attr("d", line2);

        // Add the x-axis
        let xAxis2 = d3.axisBottom(x2);
        if (selectedItem === "Weekly") {
          xAxis2.tickFormat(d3.timeFormat("%U"));
        } else if (selectedItem === "Monthly") {
          xAxis2.tickFormat(d3.timeFormat("%b %Y"));
        }
        g2.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0, ${height2})`)
          .call(xAxis2);

        // Add the y-axis
        const yAxis2 = d3.axisLeft(y2);
        g2.append("g").attr("class", "y-axis").call(yAxis2);

        // Add x-axis label
        const xAxisLabel2 =
          selectedItem === "Weekly"
            ? "Week Number"
            : selectedItem === "Monthly"
            ? "Month"
            : "Date";
        svg2
          .append("text")
          .attr(
            "transform",
            `translate(${width2 / 2 + margin.left}, ${
              height2 + margin.top + 40
            })`
          )
          .style("text-anchor", "middle")
          .text(xAxisLabel2);

        // Add y-axis label
        svg2
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", margin.left - 50)
          .attr("x", -(height2 / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Usage");
      };

      drawSecondChart();
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

  const handleSelect = (selectedOption) => {
    setSelectedItem(selectedOption.value);
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleSelectVehicle = (selectedOption) => {
    setSelectedVehicle(selectedOption.value);
  };

  return (
    <div>
      <Form.Group>
        <div className="select-container">
          <div onClick={stopPropagation}>
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
          </div>

          <div onClick={stopPropagation}>
            <Select
              value={timeItems.find((option) => option.value === selectedItem)}
              options={timeItems}
              onChange={handleSelect}
              className="basic-single view-select"
              classNamePrefix="select"
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
          {/* Add a new SVG element for the second chart */}
          <svg
            ref={svgRef2}
            width={width2 + margin.left + margin.right}
            height={height2 + margin.top + margin.bottom}
          ></svg>
        </div>
      </div>
    </div>
  );
}

export default EVUsageStatus;
