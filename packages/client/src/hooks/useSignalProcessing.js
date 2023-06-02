import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import findPeaksP3 from '../utils/findPeaksP3';
import { useControlPanel } from '../components/ControlPanel';


function pointLowPassFilter(prev, newItem, cutoffFreq, sampleRate) {
  const RC = 1 / (2 * Math.PI * cutoffFreq);
  const dt = 1 / sampleRate;
  const alpha = dt / (dt + RC);

  let current = alpha * newItem.value + (1 - alpha) * prev;

  return current;
}

export default function useSignalProcessing(animate, newItem, cutOffFrequency, itemsNo) {
  const dataRef = useRef({
    data: [],
    filteredData: [],
    herz: 0,
    peaks: [],
    newFilteredItem: null,
  });

  useEffect(() => {
    // Filtering process
    if (!newItem || newItem === undefined) return;

    const updateDataRef = (dataProperty, newValue) => {
      dataRef.current = { ...dataRef.current, [dataProperty]: newValue };
    };

    let data = dataRef.current.data;
    let filteredData = dataRef.current.filteredData;

    if (data.length >= 10) {
      let prev;
      if (filteredData.length === 0) {
        prev = data.slice(-1)[0];
      } else {
        prev = filteredData.slice(-1)[0];
      }
      let elapsed = newItem.time.getTime() - prev.time.getTime();
      let herz = 1 / (elapsed / 1000);
      updateDataRef('herz', herz);

      let newFilteredItem = {
        value: pointLowPassFilter(prev.value, newItem, 1, herz),
        time: newItem.time,
      };
      updateDataRef('newFilteredItem', newFilteredItem);

      const peakIndexes = findPeaksP3(filteredData, cutOffFrequency);
      const peaks = peakIndexes.map((i) => filteredData[i]);
      updateDataRef('peaks', peaks);

      updateDataRef('filteredData', [...filteredData.slice(-itemsNo), newFilteredItem]);
    }

    // Setting the actual data
    updateDataRef('data', [...data.slice(-itemsNo), newItem]);
  }, [animate]);


  return useMemo(() => {
    return {
      data: dataRef.current.data,
      filteredData: dataRef.current.filteredData,
      herz: dataRef.current.herz,
      peaks: dataRef.current.peaks,
      newFilteredItem: dataRef.current.newFilteredItem,
    };
  }, [animate]);
}