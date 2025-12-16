package com.prepxl.audio.service;

import com.prepxl.audio.gemini.GeminiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AudioStreamingService {

    private final GeminiClient geminiClient;

    private final List<byte[]> buffer = new ArrayList<>();
    private long lastSendTime = System.currentTimeMillis();

    public Mono<String> processPcmChunk(ByteBuffer pcmBuffer) {

        byte[] chunk = new byte[pcmBuffer.remaining()];
        pcmBuffer.get(chunk);

        buffer.add(chunk);

        long now = System.currentTimeMillis();

        // Send every 600ms
        if (now - lastSendTime < 600) {
            return Mono.just(""); // hold chunks
        }

        lastSendTime = now;

        // merge audio chunks
        int size = buffer.stream().mapToInt(b -> b.length).sum();
        byte[] combined = new byte[size];

        int offset = 0;
        for (byte[] b : buffer) {
            System.arraycopy(b, 0, combined, offset, b.length);
            offset += b.length;
        }

        buffer.clear();

        String base64 = Base64.getEncoder().encodeToString(combined);

        return geminiClient.transcribeAudio(base64);
    }
}
