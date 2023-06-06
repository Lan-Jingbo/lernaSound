import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const circleStyles = [
  { fill: "white", stroke: "black", strokeWidth: 4, textColor: "white" },
  { fill: "grey", stroke: "black", strokeWidth: 4, textColor: "white" },
];



const TimeSeriesChart = ({ chartData, rangeY, multipleCircles }) => {
  const width = 640;
  const height = 640;

  const margin = { top: 20, right: 30, bottom: 30, left: 60 };

  const svgRef = useRef();

  const Y = (arg, data) => {
    if (arg === "min") {
      return d3.min(data, (d) => d.value) * 0.8;
    }
    if (arg === "max") {
      return d3.max(data, (d) => d.value) * 1.2;
    }
  };

  useEffect(() => {
    const Ymin = rangeY.min || Y("min", chartData[0]);
    const Ymax = rangeY.max || Y("max", chartData[0]);

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove(); // Cleanup previous elements

    const x = d3
      .scaleTime()
      .range([0, width])
      .domain(d3.extent(chartData[0].map((d) => d.time)));

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

    chartData.map((data, i) => {
      svg
        .append("path")
        .datum(data)
        .attr("class", "path" + i)
        .attr("fill", "none")
        .attr("stroke", colors[i])
        .attr("stroke-width", 1.5)
        .attr("d", line);
    });

    if (multipleCircles) {
      const circleStyles = [
        { fill: "white", stroke: "black", strokeWidth: 4 },
        { fill: "grey", stroke: "black", strokeWidth: 4 },
      ];

      multipleCircles.forEach((circles, i) => {
        svg
          .append("g")
          .attr("fill", circleStyles[i].fill)
          .attr("stroke", circleStyles[i].stroke)
          .attr("stroke-width", circleStyles[i].strokeWidth)
          .selectAll("circle")
          .data(circles)
          .join("circle")
          .attr("class", `circle${i}`)
          .attr("cx", (d) => x(d.time))
          .attr("cy", (d) => y(d.value))
          .attr("r", 6);

        // Add text elements above circles
        svg
          .append("g")
          .attr("text-anchor", "middle") // Centers the text above circles
          .attr("fill", "white") // Use textColor from circleStyles array
          .selectAll("text")
          .data(circles)
          .join("text")
          .attr("class", `circleText${i}`)
          .attr("x", (d) => x(d.time))
          .attr("y", (d) => y(d.value) - 12) // 12 is an arbitrary value to position text above the circle
          .text((d) => (d.text ? d.text : ""));
      });
    }
  }, [chartData, rangeY, multipleCircles]);

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