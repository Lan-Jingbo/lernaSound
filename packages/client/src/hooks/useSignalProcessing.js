import React, { useState, useEffect, useCallback, useMemo } from 'react'
import findPeaksP3 from '../utils/findPeaksP3';
import { useControlPanel } from '../components/ControlPanel';


function pointLowPassFilter(prev, newItem, cutoffFreq, sampleRate) {
    const RC = 1 / (2 * Math.PI * cutoffFreq);
    const dt = 1 / sampleRate;
    const alpha = dt / (dt + RC);

    let current = alpha * newItem.value + (1 - alpha) * prev;

    return current;
}

export default function useSignalProcessing(newItem, cutOffFrequency, itemsNo) {

    const threshold = 0.9;

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [newFilteredItem, setNewFilteredItem] = useState();

    const [peaks, setPeaks] = useState([]);

    const [herz, setHerz] = useState(0);


    useEffect(() => {
        // filtering process
        if (data.length >= 10) {
            let prev;
            if (filteredData.length == 0) {
                prev = data.slice(-1)[0];
            } else {
                prev = filteredData.slice(-1)[0];
            }
            let elapsed = newItem.time.getTime() - prev.time.getTime();
            let herz = 1 / (elapsed / 1000);
            setHerz(herz);

            let newFilteredItem = {
                value: pointLowPassFilter(prev.value, newItem, 1, herz),
                time: newItem.time,
            };
            setNewFilteredItem(newFilteredItem);

            const peakIndexes = findPeaksP3(filteredData, cutOffFrequency);
            setPeaks(peakIndexes.map(i => filteredData[i]));

            setFilteredData([...filteredData.slice(-itemsNo), newFilteredItem])
        }

        // setting the actual data
        setData([...data.slice(-itemsNo), newItem]);
    }, [newItem]);


    return { data, filteredData, herz, peaks, newFilteredItem }
}