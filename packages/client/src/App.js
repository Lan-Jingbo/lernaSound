import React, { useRef, useEffect, useState, useCallback } from "react";
import "./App.css";
import * as d3 from "d3";
import smoothed_z_score from "./utils/smoothedZScore";
// OLD MODEL
//import * as facemesh from "@tensorflow-models/facemesh";

// NEW MODEL
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
// import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import TimeSeriesChart from "./components/timeSeriesChart";
import Grid from '@mui/material/Grid';
import ControlPanel, { useControlPanel } from "./components/ControlPanel";
import Chewing from "./pages/Chewing";

function App() {
  // const [newItem, setNewItem] = useState({ value: 0, time: new Date() });
  // const { data, filteredData, herz, peaks } = useSignalProcessing(newItem);


  return (
    <div className="App">
      <Grid container>
        {/* Control Panel */}
        <Grid item xs={3}>
          <ControlPanel />
        </Grid>

        <Grid item xs={9} container>
          <Chewing />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;