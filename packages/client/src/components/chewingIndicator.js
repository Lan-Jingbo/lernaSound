import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import * as d3 from 'd3';
import { useChewingFrequency } from '../context/Context';


const ChewingIndicator = ({ limit = 50 }) => {
    const { chewingFrequency } = useChewingFrequency();
    const d3Container = useRef(null);

    // Set up the dimensions and margins for the visualization
    const margin = { top: 10, right: 10, bottom: 30, left: 10 };
    const width = 400 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    // Create the x scale and axis
    const xScale = d3.scaleLinear()
        .domain([10, 100])
        .range([0, width]);
    const xAxis = d3.axisBottom(xScale);

    useEffect(() => {
        const svg = d3.select(d3Container.current);

        // Append the x-axis to the svg
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .attr("font-size", "10px");

        // Add the limit indicator line
        const limitX = xScale(limit);
        svg.append("line")
            .attr("x1", limitX)
            .attr("y1", 0)
            .attr("x2", limitX)
            .attr("y2", height)
            .attr("stroke", "red")
            .attr("stroke-width", 2);
    }, []);

    useEffect(() => {
        const svg = d3.select(d3Container.current);
        // Update the circle position
        svg.select(".circle")
            .attr("cx", xScale(chewingFrequency))
            .attr("cy", height / 2)
            .attr("r", 15)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        // Update the text inside the circle
        svg.select(".text")
            .attr("x", xScale(chewingFrequency))
            .attr("y", height / 2 + 5)
            .style("text-anchor", "middle")
            .text(chewingFrequency)
            .attr("font-size", "12px");
    }, [chewingFrequency])


    return (
        <Box>
            <Typography variant="subtitle1">Chewing Frequency Indicator</Typography>
            <svg
                ref={d3Container}
                viewBox={`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`}
            >
                <g transform={`translate(${margin.left},${margin.top})`}>
                    <circle className="circle" />
                    <text className="text" />
                </g>
            </svg>
            <Typography variant="caption">Current limit: {limit} Hz</Typography>
        </Box>
    );
}

export default ChewingIndicator;