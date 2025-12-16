export async function createAudioEngine(onPcm, onFreq) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;

  const freqData = new Uint8Array(analyser.frequencyBinCount);

  source.connect(analyser);

  function start() {
    function tick() {
      analyser.getByteFrequencyData(freqData);
      onFreq(freqData);
      requestAnimationFrame(tick);
    }
    tick();
  }

  function stop() {
    audioCtx.close();
  }

  return { start, stop };
}
