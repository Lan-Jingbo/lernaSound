import React, { useState, useEffect, useContext, createContext } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Tooltip
} from '@mui/material';
import Slider from '@mui/material/Slider';
import useSignalProcessing from '../hooks/useSignalProcessing';
import useRecording from '../hooks/useRecording';
import RecordingComponent from './recordingComponent';
import { useFaceMesh } from '../hooks/useFaceMesh';
import useVideoRef from '../hooks/useVideoRef';

// Create a context for the control panel data
const ControlPanelContext = createContext();

// Custom hook to use the control panel context
export const useControlPanel = () => {
    return useContext(ControlPanelContext);
};

// Control Panel Provider
export const ControlPanelProvider = ({ children }) => {
    // const videoRef = useVideoRef();
    const [itemsNo, setItemsNo] = useState(160);

    const [cutOffFrequency, setCutOffFrequency] = useState(0.5);

    // Include the useSignalProcessing logic and state in the provider
    const [newItem, setNewItem] = useState({ value: 0, time: new Date() });
    const signalProcessingData = useSignalProcessing(newItem, cutOffFrequency, itemsNo);

    // useEffect(() => {
    //     // const { data, filteredData, herz, peaks, newFilteredItem } = useSignalProcessing(newItem, cutOffFrequency, itemsNo);
    //     const signalProcessingData = useSignalProcessing(newItem, cutOffFrequency, itemsNo);
    //     setSignalProcessingData(signalProcessingData);
    // }, [newItem]);

    // const { euclideanDistance, eyePoint, namedKeypoints } = useFaceMesh(videoRef);

    // console.log(euclideanDistance);
    
    // useEffect(() => {
    //     setNewItem(euclideanDistance);
    // }, [euclideanDistance]);

    const { recording, toggleRecording, save, timeElapsed } = useRecording(newItem, signalProcessingData.newFilteredItem, signalProcessingData.peaks);

    const value = {
        itemsNo,
        setItemsNo,
        cutOffFrequency,
        setCutOffFrequency,
        data: signalProcessingData.data, // Add the useSignalProcessing data to the context
        filteredData: signalProcessingData.filteredData,
        herz: signalProcessingData.herz,
        peaks: signalProcessingData.peaks,
        setNewItem,
        recording,
        toggleRecording,
        save,
        timeElapsed,
        // videoRef,
        // euclideanDistance,
        // eyePoint,
        // namedKeypoints
    };

    return (
        <ControlPanelContext.Provider value={value}>
            {children}
        </ControlPanelContext.Provider>
    );
};

const ControlPanel = () => {
    const { itemsNo, setItemsNo, cutOffFrequency, setCutOffFrequency, recording, toggleRecording, save, timeElapsed } = useControlPanel();

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
        </Box>
    );
};

export default ControlPanel;