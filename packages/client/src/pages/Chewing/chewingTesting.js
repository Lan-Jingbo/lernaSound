import React, { useEffect, useState } from "react";
import "../../App.css";

import TimeSeriesChart from "../../components/timeSeriesChart";

// import WebCam from "../components/WebCam";
import Stack from '@mui/material/Stack';
import VideoPlayer from "../../components/videoPlayer";

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
                <TimeSeriesChart width={canvasWidth} height={canvasHeight} rangeY={{ min: null, max: null }} />
            </Stack>
        </div>
    );
}

export default ChewingTesting;