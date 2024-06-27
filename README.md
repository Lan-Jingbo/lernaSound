# Chewing Pace Detection and Intervention 😋

This is a Lerna project that aims to monitor the user's chewing pace during video playback and intervene when the chewing pace is above a set threshold. It consists of two packages: `client` and `server`.

## Overview

- **Server**: Responsible for manipulating audio pitch to augment the intervention (increasing pitch in case of excessive chewing) by downloading separate audio files for a YouTube video.
- **Client**: Implements TensorFlow.js-based facial recognition to calculate distances from the eye to the endpoints of the face oval, creating a chewing signal in response. The chew detection is conducted through low-pass filtering and peak recognition.

## Project Structure

The project is organized as follows:
```
|-- packages
    |-- client
    |-- server
```

Both packages can be started by navigating to the respective folders with `cd packages/client` or `cd packages/server` and running `npm run start`.

## Server Package

To run the server, follow these steps:
```bash
cd packages/server
npm install
npm run start
```

To manipulate the audio (increase pitch), we need to download separate audio files for a YouTube video. The backend is responsible for handling this task. All other functions occur on the frontend. This shouldn't impact user experience much as audio caching is enabled on the browser side. Ideally, this operation should happen only once.


## Client Package

To run the client, follow these steps:
```bash
cd packages/client
npm install
npm run start
```

## Frontend Package

To run the client, follow these steps:
```bash
cd packages/frontend
npm install
npm run dev
```

The client package hosts the user interface for the project and runs facial recognition to detect chewing pace fluctuations. Its functionality is split into two sections:

1. Watching
2. Testing

### Configuration (side panel)

![image](https://github.com/ollie041114/lernaSound/assets/58882951/63a43ce5-97e0-4725-9a96-cf04056bc790)

- **Cut-off frequency**: Users can test the detection in the "Testing" tab. The cut-off frequency parameter can be changed, which alters what counts as a chew. More specifically, it modifies the minimum slope of the peak to count as a chew. Moving the slider up or down adjusts the number of detected chews in the graph. A value of 0.3 tends to produce the best results for me, but you can test for yourself!

- **itemsNo**: The length of the analysis window can be adjusted (mainly for testing purposes).

### Data recording

![image](https://github.com/ollie041114/lernaSound/assets/58882951/c9c3d87d-50bb-41b5-a4cd-5e37895ff1b0)

- **recording**: Users can record data in a JSON format, which includes timestamps, the chewing signal value, and detected peaks. When recording stops, the JSON file is automatically downloaded.

### Watching

- **chewingFrequencyIndicator**: Displays the current chewing pace in chews per minute. A red line illustrates the set limit (hard-coded to 50 chews) beyond which the intervention will be triggered.

![image](https://github.com/ollie041114/lernaSound/assets/58882951/8e71353f-9383-4910-b16d-badb00bc3d93)

During video playback, if the chewing pace surpasses the specified threshold, the audio pitch of the video will be changed proportionally to the deviation from the norm of 50 chews per minute.

## Main Models Used**:
    MediaPipe Facemesh:

    Library: TensorFlow.js Face Landmarks Detection Module
    Purpose: Facial landmarks detection for chewing and gaze detection.

- **Eye Aspect Ratio (EAR)**:

    Purpose: Gaze detection to determine if the participant is watching the video.

- **COCO-SSD**:

    Library: TensorFlow.js
    Purpose: Food item detection in video frames.

- **Quantize Module**:

    Library: npm
    Purpose: Food color extraction from detected food items.

- **Chewing Detection Model**
    The chewing detection model leverages the MediaPipe Facemesh Model from the TensorFlow Face Landmarks Detection Module. The process involves:

- **Facial Landmarks Detection**:
    Identifying eye points (leftEye and rightEye) and jaw points defined as:
    const faceOvalIndexes = [
    58, 172, 136, 150, 149, 176, 178, 148, 152, 377, 400, 378, 379, 365, 397, 288, 381
    ];

- **Chewing Activity Detection**:
    Calculating the average distance between the eye points and the jaw points.
    Detecting peaks in these distances over time using a low pass filter to eliminate small, non-chewing movements.
    Calculating the chewing frequency as the inverse of the elapsed time between consecutive peaks.
    Averaging the frequency over the most recent five peaks to obtain a more accurate chewing frequency.

- **Eye Aspect Ratio (EAR) for Gaze Detection**
    The EAR algorithm is used to detect if the participant is watching the video:

    Calculation:

    Measuring distances between key points around the eyes to get an EAR value.
    Using a threshold to determine if the eyes are open or closed.

- **Gaze Detection**:

    If the EAR indicates that the eyes are open for more than 10 seconds, the isGazing state is set to true.
    Food Detection Model
    The COCO-SSD model from TensorFlow.js is used for detecting food items in video frames:

- **COCO-SSD Model**:

    A pre-trained object detection model on the COCO dataset.
    Detects various objects, including food items, in a single pass, making it suitable for real-time applications.
- **Food Detection**:

    Loading the pre-trained model and running inference on video frames.
    Filtering out food objects and marking them with bounding boxes.
- **Food Color Extraction**
    The quantize module is used to extract dominant colors from detected food items:

- **Color Extraction**:
Using the quantize module to extract up to five dominant colors from the food items.
Performing this extraction in real-time for each frame containing food items.

### Notes 

npm version 9.5.1
node version v18.16.0


## TODO

### Improve tracking functionality

- **Select monitored head**: In situations where multiple individuals are eating together (e.g., family meals), the system should provide an option to select the target individual to monitor (e.g., select child's chewing pace if detecting a child amidst other diners).

- **Correct for head tilting**: Robust detection is crucial when considering restless populations, such as children. The system should be able to handle variations in head tilt angles and maintain reliable chewing pace detection.

- **Distinguish talking and chewing**: There should be a mechanism to differentiate between talking and chewing by analyzing audio data. By utilizing both audio and visual information, the system could improve the accuracy of chew detection.

- **Distinguish fast eye-blining and chewing**: There is an issue of recognizing fast blinking movements as the eye points will be somehow moved due to the blinking motion which may cause the frequency to reflect a blinking frequency, this will affect the accuracy of detection the state of watching but not chewing when the eyes are moving very rapidly. In general cases, the algorithm used in this project works well.

### Bug fixes

✅ **Fix audio issues**: Resolve any instance when two audio channels may be heard after the component unmounts. Investigate potential issues with the ToneJS library. (02/06/2023)

### Enhancements

- **Implement other interventions**: Explore additional interventions, such as visuals or changes in brightness, to further enhance the project's ability to detect and intervene with chewing pace fluctuations.

- **Hideable side panel**: Implement a feature to hide the side panel, providing a cleaner interface for users.

- **YouTube link input**: Allow users to copy and paste YouTube links for use in the application.
