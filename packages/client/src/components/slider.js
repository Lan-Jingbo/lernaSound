import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
    return `${value}°C`;
}

export default function DiscreteSlider({ sliderValue, setSliderValue }) {
    
    return (
        <Box sx={{ width: 300 }}>
            <Slider
                aria-label="Temperature"
                defaultValue={sliderValue}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={-12}
                max={12}
                value={sliderValue}
                onChange={(event) => { setSliderValue(event.target.value) }}
            />
        </Box>
    );
}