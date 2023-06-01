import { useState, useEffect, useRef } from 'react';

function useRecording(newItem, newFilteredItem, peaks) {

    const [recording, setRecording] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    
    
    const savedDataRef = useRef([]);
    const savedPeaksRef = useRef([]);
    const startTimeRef = useRef(null);

    const toggleRecording = () => {
        if (!recording) {
            startTimeRef.current = new Date().getTime();
            setTimeElapsed(0);
        }
        setRecording(!recording);
    };

    useEffect(() => {
        let interval;
        if (recording) {
            interval = setInterval(() => {
                setTimeElapsed(new Date().getTime() - startTimeRef.current);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [recording]);

    const addDataPoint = (dataPoint) => {
        savedDataRef.current.push(dataPoint);
    };

    useEffect(() => {
        if (peaks && recording) {
            const newPeaks = peaks.filter(peak => !savedPeaksRef.current.includes(peak));
            savedPeaksRef.current = [...savedPeaksRef.current, ...newPeaks];
        }
    }, [peaks, recording]);

    useEffect(() => {
        if (recording && newItem && newFilteredItem) {
            addDataPoint({
                time: newItem.time,
                rawValue: newItem.value,
                filteredValue: newFilteredItem.value,
                peak: false
            });
        }
    }, [newItem, recording]);

    const save = () => {
        const data = [...savedDataRef.current];
        const updatedSavedData = data.map((savedItem) => {
            const matchedPeak = savedPeaksRef.current.find((peak) => peak.time === savedItem.time);
            if (matchedPeak) {
                return {
                    ...savedItem,
                    peak: true
                };
            }
            return savedItem;
        });
        setTimeElapsed(0);
        const file = new Blob([JSON.stringify(updatedSavedData)], { type: 'application/json' });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'data.json';
        link.click();
    };

    return { recording, toggleRecording, save, timeElapsed };
}

export default useRecording;