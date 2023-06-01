import React, { useState, useEffect, useContext, createContext } from 'react';

import {
    Box,
    Typography,
    Tooltip
} from '@mui/material';
import Slider from '@mui/material/Slider';
// import StatusIndicator from './StatusIndicator';
import RecordingComponent from './recordingComponent';
import ChewingIndicator from './chewingIndicator';

import { useSettings } from '../context/Context';
import { useChewingFrequency } from '../context/Context';

const ControlPanel = () => {
    const { itemsNo, setItemsNo, cutOffFrequency, setCutOffFrequency, recording, toggleRecording, save, timeElapsed } = useSettings();
    const { chewingFrequency } = useChewingFrequency();

    return (
        <Box border={1} borderColor="grey.300" borderRadius={8} p={2}>
            <Typography variant="h5">Setup</Typography>

            <Typography id="itemsNo-label" gutterBottom>
                Items No: {itemsNo}
            </Typography>
            <Tooltip title="How many data points are displayed on the graph" placement="right">
                <Slider
                    value={itemsNo}
                    onChange={(e, newValue) => setItemsNo(newValue)}
                    step={1}
                    min={160}
                    max={200}
                    valueLabelDisplay="off"
                    aria-labelledby="itemsNo-label"
                />
            </Tooltip>

            <Typography id="cutOffFrequency-label" gutterBottom>
                Cut-off frequency: {cutOffFrequency.toFixed(1)}
            </Typography>
            <Tooltip
                title="The local derivative necessary for a peak to be counted as a chew"
                placement="right"
            >
                <Slider
                    value={cutOffFrequency}
                    onChange={(e, newValue) => setCutOffFrequency(newValue)}
                    step={0.1}
                    min={0}
                    max={1}
                    valueLabelDisplay="off"
                    aria-labelledby="cutOffFrequency-label"
                />
            </Tooltip>

            <RecordingComponent recording={recording} toggleRecording = {toggleRecording} save = {save} timeElapsed = {timeElapsed} />
            

            
            {/* <StatusIndicator/> */}
            <ChewingIndicator chewingFrequency={chewingFrequency} />
        </Box>
    );
};

export default ControlPanel;