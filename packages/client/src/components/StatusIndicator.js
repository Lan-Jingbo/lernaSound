// import React, { useState, useEffect } from 'react';
// import { Typography } from '@mui/material';


// const StatusIndicator = () => {
//   const { euclideanDistance } = useControlPanel();
//   const [visible, setVisible] = useState(true);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setVisible((prevVisible) => !prevVisible);
//     }, 500);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <div style={{ display: 'flex', alignItems: 'center' }}>
//       <div
//         style={{
//           width: '15px',
//           height: '15px',
//           borderRadius: '50%',
//           backgroundColor: euclideanDistance == null ? 'red' : 'green',
//           marginRight: '5px',
//           opacity: visible ? 1 : 0,
//         }}
//       />
//       <Typography
//         variant="h6"
//         component="div"
//         style={{
//           color: euclideanDistance == null ? 'red' : 'green',
//         }}
//       >
//         {euclideanDistance == null ? 'No Recording' : 'Working'}
//       </Typography>
//     </div>
//   );
// };

// export default StatusIndicator;