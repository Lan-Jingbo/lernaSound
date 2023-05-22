function euclideanDistanceSum(x, points) {
  let sum = 0;

  for (let i = 0; i < points.length; i++) {
    let dx = x.x - points[i].x;
    let dy = x.y - points[i].y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    sum += distance;
  }

  return sum / points.length;
}

export const getMesh = (predictions) => {
  // if (predictions[0] === null || predictions[0] === undefined){
  //   return;
  // }

  let namedKeypoints = null;
  let eyePoint = null;
  let euclideanDistance = null;
  if (predictions.length > 0) {
    const keypoints = predictions[0].keypoints;

    namedKeypoints = {};

    namedKeypoints["leftEye"] = keypoints.filter((obj, index) => (obj.name === "leftEye"));
    const faceOvalIndexes = [58, 172, 136, 150, 149, 176, 178, 148, 152, 377, 400, 378, 379, 365, 397, 288, 381];
    namedKeypoints["faceOval"] = faceOvalIndexes.map((d) => keypoints[d]);

    // 92 is the point of the jaw 
    eyePoint = namedKeypoints["leftEye"][0];

    // console.log(eyePoint.z);

    // let normalizeConstant = euclideanDistanceSum(keypoints[456], [keypoints[354]]);

    euclideanDistance = ({
      value: euclideanDistanceSum(eyePoint, namedKeypoints["faceOval"]),
      time: new Date(),
    });
  }
  return {
    euclideanDistance,
    eyePoint,
    namedKeypoints
  }
};


export const drawOnCanvas = (ctx, eyePoint, namedKeypoints) => {
      // draw the eyepoint
      ctx.beginPath();
      ctx.arc(eyePoint.x, eyePoint.y, 1 /* radius */, 0, 3 * Math.PI);
      ctx.fillStyle = "aqua";
      ctx.fill();
  
  
      namedKeypoints["faceOval"].map(point => {
        //      draw the face oval 
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1 /* radius */, 0, 3 * Math.PI);
        ctx.fillStyle = "aqua";
        ctx.fill();
  
        // draw the distances
  
        ctx.beginPath(); // Start a new path
        ctx.moveTo(eyePoint.x, eyePoint.y); // Move the pen to (30, 50)
        ctx.lineTo(point.x, point.y); // Draw a line to (150, 100)
        ctx.stroke(); // Render the path
      })
}