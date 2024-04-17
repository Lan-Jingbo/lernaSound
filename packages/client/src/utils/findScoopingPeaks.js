export function findScoopingPeaks(signal, threshold) {
    // Step 1: Prepare the signal data, assuming it's an array of objects with a 'value' property
    const values = signal.map(s => s.value);

    // Step 2: Identify potential peaks
    const potentialPeaks = [];
    for (let i = 1; i < values.length - 1; i++) {
        if (values[i] > values[i - 1] && values[i] > values[i + 1]) {
            potentialPeaks.push({ index: i, value: values[i] });
        }
    }

    // Step 3: Calculate the slopes and filter based on the threshold
    const scoopingPeaks = potentialPeaks.filter(peak => {
        const leftIndex = Math.max(peak.index - 1, 0);
        const rightIndex = Math.min(peak.index + 1, values.length - 1);
        const leftSlope = peak.value - values[leftIndex];
        const rightSlope = peak.value - values[rightIndex];

        return leftSlope > threshold && rightSlope > threshold;
    }).map(peak => peak.index);

    return scoopingPeaks;
}