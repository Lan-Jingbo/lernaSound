import { useState, useEffect } from 'react';

function useRecording(newItem, newFilteredItem, peaks) {
    
    const [recording, setRecording] = useState(false);
    const [savedData, setSavedData] = useState([]);
    const [savedPeaks, setSavedPeaks] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);

    const toggleRecording = () => {
        if (!recording) {
            setStartTime(new Date().getTime());
            setTimeElapsed(0);
        }
        setRecording(!recording);
    };

    useEffect(() => {
        let interval;
        if (recording) {
            interval = setInterval(() => {
                setTimeElapsed(new Date().getTime() - startTime);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [recording, startTime]);

    const addDataPoint = (dataPoint) => {
        setSavedData([...savedData, dataPoint]);
    };

    useEffect(() => {
        if (peaks && recording) {
            const newPeaks = peaks.filter(peak => !savedPeaks.includes(peak));
            setSavedPeaks(prevSavedPeaks => [...prevSavedPeaks, ...newPeaks]);
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
    }, [newItem, newFilteredItem, recording]);

    const save = () => {
        const data = [...savedData];
        const updatedSavedData = data.map((savedItem) => {
            const matchedPeak = savedPeaks.find((peak) => peak.time == savedItem.time);
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