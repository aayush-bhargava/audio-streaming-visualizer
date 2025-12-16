let ws: WebSocket | null = null;

export function connectToAudioStream(onTranscript: (text: string) => void) {
  ws = new WebSocket("ws://localhost:8080/audio-stream");

  ws.binaryType = "arraybuffer";

  ws.onopen = () => console.log("WS CONNECTED ✅");
  ws.onerror = (err) => console.error("WS ERROR ❌", err);
  ws.onclose = () => console.log("WS CLOSED ❌");

  ws.onmessage = (event) => {
    const text = event.data;
    onTranscript(text);
  };
}

export function sendPcmChunk(chunk: Float32Array) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  // Convert Float32 → Int16
  const pcm16 = new Int16Array(chunk.length);
  for (let i = 0; i < chunk.length; i++) {
    let s = Math.max(-1, Math.min(1, chunk[i])); // clamp
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  ws.send(pcm16.buffer);  // send proper PCM16 bytes
}