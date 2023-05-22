import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopIcon from '@mui/icons-material/Stop';

import { useControlPanel } from './ControlPanel';

const RecordingComponent = ({ recording, toggleRecording, save, timeElapsed }) => {
    const [savedTime, setSavedTime] = useState(0);

    const formatTime = (time) => {
        if (time === 0) return '0h 0m 0s';
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const handleSave = () => {
        save();
    };

    return (
        <Box>
            <Button
                variant="contained"
                color={recording ? 'secondary' : 'primary'}
                onClick={() => {
                    setSavedTime(timeElapsed);
                    toggleRecording();
                }}
                startIcon={recording ? <StopIcon /> : <FiberManualRecordIcon />}
            >
                {recording ? formatTime(timeElapsed) : 'Start Recording'}
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                style={{ marginLeft: '10px' }}
                disabled={recording || timeElapsed === 0}
            >
                {`Save (${formatTime(savedTime)})`}
            </Button>
        </Box>
    );
};

export default RecordingComponent;