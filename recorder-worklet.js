class RecorderWorklet extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];

    if (input && input[0]) {
      const samples = new Float32Array(input[0]);
      this.port.postMessage(samples, [samples.buffer]); 
    }

    return true;
  }
}

registerProcessor("recorder-worklet", RecorderWorklet);