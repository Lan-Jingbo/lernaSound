import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function Chart({ data }) {
  const svgRef = useRef(null);
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 400 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;


  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Define scales and axes
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([height, 0]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Update x axis with transition
    svg.select('.x.axis')
      .transition()
      .duration(1000)
      .call(xAxis);

    // Update y axis with transition
    svg.select('.y.axis')
      .transition()
      .duration(1000)
      .call(yAxis);
  }, [data, height, margin.bottom, margin.left, margin.right, margin.top, width]);

  return (
    <svg ref={svgRef} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
      <g className="x axis" transform={`translate(0, ${height})`} />
      <g className="y axis" />
      {/* Add other chart elements here */}
    </svg>
  );
}

export default Chart;