import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';



export const usePitchShift = (audioFileLink) => {
    const [player, setPlayer] = useState(null);
    const [intermediateGain, setIntermediateGain] = useState(null);
    const [pitchShiftNode, setPitchShiftNode] = useState(null);
    const bufferRef = useRef();
  
    useEffect(() => {
      if (!audioFileLink) return;
  
      if (player) return;
  
      (async () => {
        bufferRef.current = new Tone.Buffer(audioFileLink, async () => {
          const originalPlayer = new Tone.Player(bufferRef.current);
          const intermediateGainNode = new Tone.Gain(1).toDestination();
  
          // Connect the player to the intermediate gain node
          originalPlayer.connect(intermediateGainNode);
  
          // Start the player
          await Tone.loaded();
          originalPlayer.sync().start(0);
  
          setPlayer(originalPlayer);
          setIntermediateGain(intermediateGainNode);
        });
      })();
  
      return () => {
        if (intermediateGain) {
          intermediateGain.disconnect();
        }
        if (player) {
          player.sync(-1).stop();
        }
      };
    }, [audioFileLink]);
  
    const changePitchShift = (newPitchShiftAmount) => {
      if (pitchShiftNode) {
        pitchShiftNode.disconnect();
        pitchShiftNode.dispose();
      } else {
        player.disconnect(intermediateGain);
      }
  
      const pitchShift = new Tone.PitchShift(newPitchShiftAmount);
      player.chain(pitchShift, intermediateGain);
      setPitchShiftNode(pitchShift);
    };
  
    return {
      player,
      changePitchShift,
    };
  };