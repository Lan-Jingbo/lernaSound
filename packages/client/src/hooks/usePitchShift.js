import { useEffect, useRef } from "react";
import * as Tone from "tone";

export const usePitchShift = (audioFileLink) => {
  const playerRef = useRef(null);
  const pitchShiftNodeRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let cleanup;
    let originalPlayer;

    (async () => {
      if (!playerRef.current && audioFileLink) {
        const buffer = await Tone.Buffer.fromUrl(audioFileLink);

        if (isMounted){
          console.log("Player is: ", originalPlayer);
          originalPlayer = new Tone.Player(buffer);
          await Tone.loaded();
          originalPlayer.sync().start(0);
          playerRef.current = originalPlayer;
          playerRef.current.toDestination();
        }

      }
    })();

    cleanup = () => {
      isMounted = false;
      if (playerRef.current) {
        playerRef.current.sync(-1).stop();
        playerRef.current.disconnect();
        playerRef.current.dispose();

        console.log(playerRef.current._wasDisposed);
      }
    };

    return cleanup;
  }, [audioFileLink]);

  const changePitchShift = (newPitchShiftAmount) => {
    playerRef.current.toDestination();
    const player = playerRef.current;

    if (pitchShiftNodeRef.current) {
      pitchShiftNodeRef.current.dispose();
    }

    if (newPitchShiftAmount === 0) {
      player.disconnect();
      player.toDestination();
      pitchShiftNodeRef.current = null;
    } else {
      player.disconnect();
      const pitchShift = new Tone.PitchShift(newPitchShiftAmount);
      player.chain(pitchShift, Tone.Destination);
      pitchShiftNodeRef.current = pitchShift;
    }
  };

  return {
    player: playerRef.current,
    changePitchShift,
  };
};