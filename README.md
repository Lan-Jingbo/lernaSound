# lernaSound

# Chewing Pace Detection and Intervention

This is a Lerna project that aims to monitor the user's chewing pace during video playback and intervene when the chewing pace is above a set threshold. It consists of two packages: `client` and `server`.

## Overview

- Server: Responsible for manipulating audio pitch to augment the intervention (increasing pitch in case of excessive chewing) by downloading separate audio files for a YouTube video.
- Client: Implements TensorFlow.js-based facial recognition to calculate distances from the eye to the endpoints of the face oval, creating a chewing signal in response. The chew detection is conducted through low-pass filtering and peak recognition.

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

The client package hosts the user interface for the project and runs facial recognition to detect chewing pace fluctuations. Its functionality is split into two sections:

1. Watching
2. Testing

### Configuration (side panel)

- **Cut-off frequency**: Users can test the detection in the "Testing" tab. The cut-off frequency parameter can be changed, which alters what counts as a chew. More specifically, it modifies the minimum slope of the peak to count as a chew. Moving the slider up or down adjusts the number of detected chews in the graph. A value of 0.3 tends to produce the best results for me, but you can test for yourself!

- **itemsNo**: The length of the analysis window can be adjusted (mainly for testing purposes).

### Data recording

- **recording**: Users can record data in a JSON format, which includes timestamps, the chewing signal value, and detected peaks. When recording stops, the JSON file is automatically downloaded.

### Watching

- **chewingFrequencyIndicator**: Displays the current chewing pace in chews per minute. A red line illustrates the set limit (hard-coded to 50 chews) beyond which the intervention will be triggered.

During video playback, if the chewing pace surpasses the specified threshold, the audio pitch of the video will be changed proportionally to the deviation from the norm of 50 chews per minute.
