"use client";

import { useRef, useState, useEffect } from "react";
import { createAudioEngine } from "./audio/audio";
import { connectToAudioStream } from "../lib/audio-stream";
import VisualizerCanvas from "./VisualizerCanvas";

export default function VisualizerPage() {
  const [freq, setFreq] = useState(new Uint8Array(1024));
  const [transcript, setTranscript] = useState("");   // SINGLE transcript state
  const [micActive, setMicActive] = useState(false);
  const engineRef = useRef<any>(null);

  const startMic = async () => {
    if (!engineRef.current) {
      engineRef.current = await createAudioEngine(
        () => {}, // PCM forwarded automatically
        (freqData) => setFreq(freqData)
      );
    }

    connectToAudioStream((text) => {
      console.log("TRANSCRIPT:", text);
      setTranscript(text);  // <-- FIXED
    });

    await engineRef.current.start();
    setMicActive(true);
  };

  const stopMic = async () => {
    if (engineRef.current) {
      await engineRef.current.stop();
      setMicActive(false);
    }
  };

  // Auto-connect only once (optional)
  useEffect(() => {
    connectToAudioStream((t) => setTranscript(t)); // <-- FIXED
  }, []);

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col items-center p-6 space-y-6">
      <h1 className="text-3xl font-bold">Circular Audio Visualizer</h1>

      <VisualizerCanvas freq={freq} />

      <button
        onClick={micActive ? stopMic : startMic}
        className={`px-6 py-2 rounded-lg ${
          micActive ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {micActive ? "🛑 Stop Mic" : "🎤 Start Mic"}
      </button>

      <div className="bg-black/40 w-full max-w-xl p-4 rounded-lg border border-white/20">
        <h2 className="text-lg font-semibold mb-2">Real-time Transcription</h2>
        <p className="text-gray-300 whitespace-pre-wrap">{transcript}</p>
      </div>
    </div>
  );
}
