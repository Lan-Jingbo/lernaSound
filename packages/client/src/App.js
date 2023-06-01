import React, { useRef, useEffect, useState, useCallback } from "react";
import "./App.css";

import Grid from '@mui/material/Grid';
import ControlPanel from "./components/ControlPanel";
import Chewing from "./pages/Chewing";

function App() {
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