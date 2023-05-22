import React from 'react';
import { Typography } from '@mui/material';
import { useControlPanel } from './ControlPanel';


const StatusIndicator = () => {
  const { euclideanDistance } = useControlPanel();

  return (
    <Typography
      variant="h6"
      component="div"
      style={{
        color: euclideanDistance == null ? 'red' : 'green',
      }}
    >
      {euclideanDistance == null ? 'No Recording' : 'Working'}
    </Typography>
  );
};

export default StatusIndicator;