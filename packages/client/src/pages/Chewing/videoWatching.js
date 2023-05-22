import React, { useState, useEffect } from 'react';
import * as Tone from "tone";
import YouTube from 'react-youtube';
import DiscreteSlider from "../../components/slider";
import { usePitchShift } from '../../hooks';
import WebCam from "../../components/WebCam";
import Stack from '@mui/material/Stack';



const videoId = "HW4LSaJs7fo";

// const player = new Tone.Player('YOUR_AUDIO_URL').toDestination();
function VideoWatching() {


  const [audioUrl, setAudioUrl] = useState('');
  // const [player, setPlayer] = useState(null);
  const [pitchedPlayer, setPitchedPlayer] = useState(null);
  const [youtube, setYouTube] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const {player, changePitchShift} = usePitchShift(audioUrl);

  const [pitch, setPitch] = useState(0);


  const handleGetAudio = async (videoId) => {
    try {
      const res = await fetch(`http://localhost:3001/audio/${videoId}`);
      if (!res.ok) {
        throw new Error('Failed to get audio from server.');
      }
      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      await Tone.start();
      setAudioUrl(audioUrl);
      // Play the audio file

    } catch (error) {
      console.error('Failed to get audio from server.', error);
    }
  };

  const onYouTubeIframeAPIReady = (event) => {
    const player = event.target;
    setYouTube(player);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      Tone.Transport.pause();
      youtube?.pauseVideo();

      setIsPlaying(false);
    } else {
      Tone.Transport.start();
      youtube.playVideo();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    console.log(player);
  }, [player]);

  useEffect(() => {
    if (player) {
      // Apply a pitch shift to a new player, based on the original player
      changePitchShift(pitch);
    }
  }, [pitch]);

  return (
    <div>
      <button onClick={() => handleGetAudio(videoId)}>
        Get Audio
      </button>


      {player &&
        (
          <div className="hidden-youtube-player">

            <YouTube
              videoId={videoId}
              onReady={onYouTubeIframeAPIReady}
              opts={{
                width: '640', height: '640',
                playerVars: {
                  autoplay: 0,
                  controls: 0,
                  mute: 1
                }
              }}
            />

            <div>Pithc shift by: </div>

            <DiscreteSlider
              sliderValue={pitch}
              setSliderValue={setPitch}
            />

            {/* Control playback with a single button */}
            <button onClick={togglePlayback}>{isPlaying ? 'Pause' : 'Play'}</button>
          </div>
        )
      }
    </div >
  );
}

export default VideoWatching;