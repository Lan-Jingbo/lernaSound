import React, { useEffect, useState } from "react";
import "../../App.css";

import TimeSeriesChart from "../../components/timeSeriesChart";

// import WebCam from "../components/WebCam";
import Stack from '@mui/material/Stack';
import VideoPlayer from "../../components/videoPlayer";

import { useData } from "../../context/Context";
import { useVideo } from "../../context/Context";

function calculateCorrelation(arr1, arr2, windowSize) {
    if (arr1.length !== arr2.length) {
        console.error("Arrays must have the same length");
        return null;
    }

    const arr1Values = arr1.map(item => item.value);
    const arr2Values = arr2.map(item => item.value);

    const mean = (data) => {
        return data.reduce((a, b) => a + b) / data.length;
    };

    const stdDev = (data, dataMean) => {
        const sqDiff = data.map((item) => Math.pow(item - dataMean, 2));
        return Math.sqrt(sqDiff.reduce((a, b) => a + b) / sqDiff.length);
    };

    const correlationCoefficients = [];

    for (let i = 0; i <= arr1.length - windowSize; i++) {
        const arr1Window = arr1Values.slice(i, i + windowSize);
        const arr2Window = arr2Values.slice(i, i + windowSize);

        const arr1Mean = mean(arr1Window);
        const arr2Mean = mean(arr2Window);

        const arr1StdDev = stdDev(arr1Window, arr1Mean);
        const arr2StdDev = stdDev(arr2Window, arr2Mean);

        let correlationCoefficient = 0;
        for (let j = 0; j < windowSize; j++) {
            correlationCoefficient += ((arr1Window[j] - arr1Mean) * (arr2Window[j] - arr2Mean)) / (arr1StdDev * arr2StdDev);
        }
        correlationCoefficient /= windowSize;

        correlationCoefficients.push({
            value: Math.abs(correlationCoefficient),
            time: arr1[i + Math.floor(windowSize / 2)].time, // use the middle time of the window
        });
    }

    return correlationCoefficients;
}

const EyeJawDistanceChart = () => {
    const { data, filteredData, filteredPeaks, removedPeaks, eyePointDistance } = useData();

    const organizedData1 = [data, filteredData];
    const organizedData2 = [eyePointDistance];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <h3 style={{ color: "white" }}> Eye to Jaw Distances Summation</h3>
                <TimeSeriesChart chartData={organizedData1} rangeY={{}} multipleCircles={[filteredPeaks, removedPeaks]} />
            </div>

            <div>
                <h3 style={{ color: "white" }}> Eye to Jaw Distances Summation</h3>
                <TimeSeriesChart chartData={organizedData2} rangeY={{}} />
            </div>
        </div>
    );
};


function ChewingTesting() {

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const webcamWidth = (width * 3) / 4;
    const webcamHeight = height / 2;
    const canvasWidth = (width * 3) / 4;
    const canvasHeight = height / 2;

    return (
        <div>
            <Stack spacing={2}>
                <VideoPlayer width={webcamWidth} height={webcamHeight} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <EyeJawDistanceChart />
                </div>
            </Stack>
        </div>
    );
}

export default ChewingTesting;