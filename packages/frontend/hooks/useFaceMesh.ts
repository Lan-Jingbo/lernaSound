import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMesh } from "@/utils/testing";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";

export const useFaceMesh = (
  videoRef: React.RefObject<HTMLVideoElement> | null
) => {
  const effectRan = useRef(false);
  const [animate, setAnimate] = useState(false);
  const meshDataRef = useRef<MeshResult>({
    euclideanDistance: null,
    eyePoint: null,
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
          const { euclideanDistance, eyePoint, namedKeypoints } = getMesh(
            face as Prediction[]
          );
          meshDataRef.current = {
            euclideanDistance,
            eyePoint,
            namedKeypoints,
          };
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
      eyePoint: meshDataRef.current.eyePoint,
      namedKeypoints: meshDataRef.current.namedKeypoints,
    }),
    [animate]
  );
};
