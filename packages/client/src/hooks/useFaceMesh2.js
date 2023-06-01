import React, { useRef, useEffect, useState, useCallback } from "react";
import { getMesh } from "../utils/utilities";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";

export const useFaceMesh = (videoRef) => {

    const meshDataRef = useRef({
        euclideanDistance: null,
        eyePoint: null,
        namedKeypoints: null,
    });

    const runFacemesh = useCallback(async () => {

        const detect = async (net) => {
            if (
                // check if webcam works, and we receive data
            typeof videoRef.current !== "undefined" &&
            videoRef.current !== null &&
            videoRef.current.readyState === 4
            ) {
                // Get Video Properties
                const video = videoRef.current;

                const face = await net.estimateFaces(video);

                requestAnimationFrame(() => {
                    const meshData = getMesh(face);
                    meshDataRef.current = meshData;
                }
                );
            }
        };

        const detectorConfig = {
            runtime: 'mediapipe', // or 'tfjs'
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        }
        const detector = await facemesh.createDetector(facemesh.SupportedModels.MediaPipeFaceMesh, detectorConfig);

        setInterval(() => {
            detect(detector);
        }, UPDATE_MS);
    }, []);

    useEffect(() => { runFacemesh() }, []);

    return {
        euclideanDistance: meshDataRef.current.euclideanDistance,
        eyePoint: meshDataRef.current.eyePoint,
        namedKeypoints: meshDataRef.current.namedKeypoints
    }
}