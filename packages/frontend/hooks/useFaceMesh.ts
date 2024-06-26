import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMesh } from "@/utils/testing";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import { MeshResult, Prediction, Keypoint } from "@/types/types"; 

export const useFaceMesh = (
  videoRef: React.RefObject<HTMLVideoElement> | null
) => {
  const effectRan = useRef(false);
  const [animate, setAnimate] = useState(false);
  const [lookingAtScreen, setLookingAtScreen] = useState(false);
  const meshDataRef = useRef<MeshResult>({
    euclideanDistance: null,
    leftEyePoint: null,
    rightEyePoint: null,
    namedKeypoints: null,
  });

  const UPDATE_MS = 20;
  const intervalRef = useRef<number | null>(null);

  const runFacemesh = useCallback(async () => {
    const detect = async (net: facemesh.FaceLandmarksDetector) => {
      if (videoRef && videoRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current;
        const face = await net.estimateFaces(video);

        if (face) {
          const { euclideanDistance, leftEyePoint, rightEyePoint, namedKeypoints } = getMesh(
            face as Prediction[]
          );

          meshDataRef.current = {
            euclideanDistance,
            leftEyePoint,
            rightEyePoint,
            namedKeypoints,
          };

          // Check if the user is looking at the screen
          if (namedKeypoints && namedKeypoints["leftEye"] && namedKeypoints["rightEye"]) {
            const isLooking = isLookingAtScreen(namedKeypoints["leftEye"], namedKeypoints["rightEye"]);
            setLookingAtScreen(isLooking);
          }

          setAnimate((prevCheck) => !prevCheck);
        }
      }
    };

    const detectorConfig: facemesh.MediaPipeFaceMeshMediaPipeModelConfig = {
      runtime: "mediapipe",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
      refineLandmarks: true,
    };

    const detector = await facemesh.createDetector(
      facemesh.SupportedModels.MediaPipeFaceMesh,
      detectorConfig
    );

    intervalRef.current = window.setInterval(() => {
      detect(detector);
    }, UPDATE_MS);
  }, [videoRef]);

  useEffect(() => {
    if (!videoRef || !videoRef.current) return;

    if (effectRan.current === false) {
      runFacemesh();
      effectRan.current = true;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [runFacemesh, videoRef]);

  return useMemo(
    () => ({
      animate,
      euclideanDistance: meshDataRef.current.euclideanDistance,
      leftEyePoint: meshDataRef.current.leftEyePoint,
      rightEyePoint: meshDataRef.current.rightEyePoint,
      namedKeypoints: meshDataRef.current.namedKeypoints,
      lookingAtScreen,
    }),
    [animate, lookingAtScreen]
  );
};

function isLookingAtScreen(leftEye: Keypoint[], rightEye: Keypoint[]): boolean {
  const leftEAR = calculateEAR(leftEye);
  const rightEAR = calculateEAR(rightEye);

  // Threshold for EAR to consider eyes open
  const EAR_THRESHOLD = 0.2;

  if (leftEAR < EAR_THRESHOLD || rightEAR < EAR_THRESHOLD) {
    // Eyes are likely closed
    return false;
  }

  // Calculate the average horizontal distance between inner and outer corners of the eyes
  const leftEyeHorizontalDistance = euclideanDistance(leftEye[0], leftEye[3]);
  const rightEyeHorizontalDistance = euclideanDistance(rightEye[0], rightEye[3]);

  // Calculate the average distance from the eye center to the nose bridge (landmark 1)
  const leftEyeToNoseDistance = euclideanDistance(leftEye[0], { x: leftEye[0].x, y: leftEye[0].y });
  const rightEyeToNoseDistance = euclideanDistance(rightEye[0], { x: rightEye[0].x, y: rightEye[0].y });

  // Heuristic to determine if looking at the screen
  const lookingAtScreen = leftEyeToNoseDistance < leftEyeHorizontalDistance / 2 &&
                          rightEyeToNoseDistance < rightEyeHorizontalDistance / 2;

  return lookingAtScreen;
}

function calculateEAR(eye: Keypoint[]): number {
  // Placeholder implementation for EAR calculation
  // Add the actual implementation of calculateEAR function based on your requirement
  return 0.3; // Adjust this value based on your calculation
}

function euclideanDistance(point1: Keypoint, point2: Keypoint): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
