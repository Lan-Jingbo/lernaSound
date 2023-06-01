import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useData } from "../context/Context";

const fill = "white"; // fill color of dots
const stroke = "black"; // stroke color of line and dots
const strokeWidth = 2; // stroke width of line and dots

const TimeSeriesChart = ({ rangeY }) => {
  const width = 640;
  const height = 640;

  const { data, filteredData, peaks: circles } = useData();

  const margin = { top: 20, right: 30, bottom: 30, left: 60 };
  // width = width - margin.left - margin.right;
  // height = height - margin.top - margin.bottom;

  const svgRef = useRef();

  const Y = (arg, data) => {
    if (arg == "min") {
      return d3.min(data, (d) => d.value) * 0.8;
    }
    if (arg == "max") {
      return d3.max(data, (d) => d.value) * 1.2;
    }
  };

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
    const Ymin = rangeY.min | Y("min", data);
    const Ymax = rangeY.max | Y("max", data);

    const svg = d3.select(svgRef.current);

    const x = d3
      .scaleTime()
      .range([0, width])
      .domain(d3.extent(data.map((d) => d.time)));

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([Ymin, Ymax]);

    const xAxis = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    svg.append("g").call(yAxis);

    const line = d3.line().x((d) => x(d.time)).y((d) => y(d.value));

    const colors = ["steelblue", "red"];

    [data, filteredData].map((data, i) => {
      svg
        .append("path")
        .datum(data)
        .attr("class", "path" + i)
        .attr("fill", "none")
        .attr("stroke", colors[i])
        .attr("stroke-width", 1.5)
        .attr("d", line);
    });

    svg
      .append("g")
      .attr("fill", fill)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .selectAll("circle")
      .data(circles)
      .join("circle")
      .attr("class", "circle")
      .attr("cx", (d) => x(d.time))
      .attr("cy", (d) => y(d.value))
      .attr("r", 3);
    }
    return () => { ignore = true };
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const updateChart = () => {
      const Ymin = rangeY.min | Y("min", data);
      const Ymax = rangeY.max | Y("max", data);
      const updatedX = d3
        .scaleTime()
        .range([0, width])
        .domain(d3.extent(data, (d) => d.time));

      const updatedY = d3
        .scaleLinear()
        .range([height, 0])
        .domain([Ymin, Ymax]);

      const xAxis = d3.axisBottom(updatedX);

      const yAxis = d3.axisLeft(updatedY);

      const updatedLine = d3
        .line()
        .x((d) => updatedX(d.time))
        .y((d) => updatedY(d.value));

      svg.select(".x.axis").transition().duration(100).call(xAxis);

      svg.select(".y.axis").transition().duration(100).call(yAxis);

      svg.selectAll(".circle").remove();

      svg
        .append("g")
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .selectAll("circle")
        .data(circles)
        .join("circle")
        .attr("class", "circle")
        .attr("cx", (d) => updatedX(d.time))
        .attr("cy", (d) => updatedY(d.value))
        .attr("r", 9);

      [data, filteredData].map((data,i) => {
        svg
          .select(".path" + i)
          .datum(data)
          .transition()
          .duration(100)
          .attr("d", updatedLine);
      });
    };
    updateChart();
  }, [data]);

  return (
    <div>
      <svg
        ref={svgRef}
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      >
        <g className="x axis" transform={`translate(0, ${height})`} />
        <g className="y axis" />
      </svg>
    </div>
  );
};

export default TimeSeriesChart;