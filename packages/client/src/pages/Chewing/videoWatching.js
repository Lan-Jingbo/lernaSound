// import React, { useState, useEffect, useRef } from 'react';
// import * as Tone from 'tone';
// import YouTube from 'react-youtube';
// import DiscreteSlider from '../../components/slider';
// import { usePitchShift } from '../../hooks';
// import CircularProgress from '@mui/material/CircularProgress';
// import IconButton from '@mui/material/IconButton';
// import PauseIcon from '@mui/icons-material/Pause';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import '../../App.css';
// import localforage from 'localforage';
// import * as d3 from 'd3';
// import { useChewingFrequency } from '../../context/Context';

// const videoId = 'IaO_kRsMA3I';


// function VideoWatching() {

//   const { chewingFrequency } = useChewingFrequency();

//   const [audioUrl, setAudioUrl] = useState('');
//   const [youtube, setYouTube] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const { player, changePitchShift } = usePitchShift(audioUrl);

//   const [pitch, setPitch] = useState(0);

//   const handleGetAudio = async (videoId) => {
//     setLoading(true);
//     try {
//       const cachedAudioBlob = await localforage.getItem(videoId);
//       if (cachedAudioBlob) {
//         console.log('Loaded audio Blob from local storage');
//         const cachedAudioUrl = URL.createObjectURL(cachedAudioBlob);
//         setAudioUrl(cachedAudioUrl);
//         await Tone.start();
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(`http://localhost:3001/audio/${videoId}`);
//       if (!res.ok) {
//         throw new Error('Failed to get audio from server.');
//       }
//       const audioBlob = await res.blob();
//       console.log(audioBlob);
//       const audioUrl = URL.createObjectURL(audioBlob);
//       await Tone.start();
//       setAudioUrl(audioUrl);

//       // Save audio Blob to local storage
//       await localforage.setItem(videoId, audioBlob);
//       console.log('Saved audio Blob to local storage');
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       console.error('Failed to get audio from server.', error);
//     }
//   };

//   const onYouTubeIframeAPIReady = (event) => {
//     const player = event.target;
//     setYouTube(player);
//   };

//   const togglePlayback = () => {
//     if (isPlaying) {
//       youtube?.pauseVideo();
//     } else {
//       youtube.playVideo();
//     }
//   };

//   useEffect(() => {
//     return () => {
//       Tone.Transport.pause();

//       if (youtube) {
//         youtube.destroy();
//       }
//       // Add the following lines to stop and clean up Tone.Transport
//       Tone.Transport.stop();
//       Tone.Transport.cancel();
//     };
//   }, []); // Add an empty dependency

  
//   const onPlayerStateChange = (event) => {
//     const playerState = event.target.getPlayerState();
//     if (playerState === 1) {
//       Tone.Transport.start();
//       setIsPlaying(true);
//     } else if (playerState === 2) {
//       Tone.Transport.pause();
//       setIsPlaying(false);
//     }
//   };

//   useEffect(() => {
//     handleGetAudio(videoId);
//   }, []);

//   useEffect(() => {
//     if (!isPlaying) return;
//     if (chewingFrequency > 50 && chewingFrequency <= 80) {
//       const pitch = d3.scaleLinear()
//         .domain([50, 80])
//         .range([1, 12])
//         .clamp(true)(chewingFrequency);

//       setPitch(pitch);
//     } else {
//       setPitch(0);
//     }
//   }, [chewingFrequency]);

//   useEffect(() => {
//     if (player) {
//       changePitchShift(pitch);
//     }
//   }, [pitch]);

//   return (
//     <div>
//       {loading ? (
//         <CircularProgress />
//       ) : (
//         player && (
//           <div>
//             <div className="youtube-wrapper">
//               <YouTube
//                 videoId={videoId}
//                 onReady={onYouTubeIframeAPIReady}
//                 onStateChange={onPlayerStateChange}
//                 opts={{
//                   width: '640',
//                   height: '640',
//                   playerVars: {
//                     autoplay: 0,
//                     controls: 0,
//                     mute: 1,
//                   },
//                 }}
//               />
//             </div>
//             <div>Pitch shift by: </div>
//             <MemoSlider pitch = {pitch} setPitch = {setPitch} />
//           </div>
//         )
//       )}
//     </div>
//   );
// }

// const MemoSlider = React.memo(
//   ({ pitch, setPitch }) => (
//     <DiscreteSlider sliderValue={pitch} setSliderValue={setPitch} />
//   ),
//   (prevProps, nextProps) => {
//     return prevProps.pitch === nextProps.pitch;
//   }
// );

// export default VideoWatching;

import React, { useState } from 'react';
import YouTube from 'react-youtube';

function VideoWatching() {
  const [videoId, setVideoId] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Extract the video ID from the YouTube URL
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const id = extractVideoId(inputValue);
    if (id) {
      setVideoId(id);
    } else {
      alert('Please enter a valid YouTube URL.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter YouTube URL"
        />
        <button type="submit">Load Video</button>
      </form>
      {videoId && (
        <YouTube
          videoId={videoId}
          opts={{
            width: '640',
            height: '390',
            playerVars: {
              autoplay: 1,
            },
          }}
        />
      )}
    </div>
  );
}

export default VideoWatching;