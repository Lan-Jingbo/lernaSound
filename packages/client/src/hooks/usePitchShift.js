import { useState, useEffect } from 'react';
import * as Tone from 'tone';
export const usePitchShift = (audioFileLink) => {
    const [player, setPlayer] = useState(null);
    const [intermediateGain, setIntermediateGain] = useState(null);
    const [pitchShiftNode, setPitchShiftNode] = useState(null);


    useEffect(() => {
        if (!audioFileLink) return;

        if (player) return;

        (async () => {
            const audioBuffer = new Tone.Buffer(audioFileLink, async () => {
                const originalPlayer = new Tone.Player(audioBuffer);
                const intermediateGainNode = new Tone.Gain(1).toDestination();

                // Connect the player to the intermediate gain node
                originalPlayer.connect(intermediateGainNode);

                // Start the player
                await Tone.loaded();
                originalPlayer.sync().start(0);
                // originalPlayer.sync();
                setPlayer(originalPlayer);
                setIntermediateGain(intermediateGainNode);
            });
        })();
    }, [audioFileLink]);

    const changePitchShift = (newPitchShiftAmount) => {
            // player.disconnect();
            if (pitchShiftNode) {
                pitchShiftNode.disconnect();
                pitchShiftNode.dispose();
            } else {
                player.disconnect();
            }
            // const intermediateGainNode = new Tone.Gain(1).toDestination();

            //   const connectedEffectNodes = intermediateGain.effects.slice(0);
            //   // Disconnect any existing pitch shift effect(s)
            //   connectedEffectNodes.forEach((effectNode) => intermediateGain.disconnect(effectNode));

            // Create and connect a new pitch shift effect
            const pitchShift = new Tone.PitchShift(newPitchShiftAmount);
            player.chain(pitchShift, intermediateGain);
            // player.connect(pitchShift);
            // pitchShift.connect(intermediateGain);
            setPitchShiftNode(pitchShift);
    };

    return {
        player,
        changePitchShift,
    };
};