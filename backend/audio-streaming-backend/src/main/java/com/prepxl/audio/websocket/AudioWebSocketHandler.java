package com.prepxl.audio.websocket;

import com.prepxl.audio.service.AudioStreamingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.ByteBuffer;

@Slf4j
@Component
@RequiredArgsConstructor
public class AudioWebSocketHandler implements WebSocketHandler {

    private final AudioStreamingService audioService;

    @Override
    public Mono<Void> handle(WebSocketSession session) {

        // Receive incoming binary PCM chunks from the browser
        Flux<ByteBuffer> incomingPcm = session
                .receive()
                .map(WebSocketMessage::getPayload)
                .map(buf -> buf.asByteBuffer());

        // Process PCM → Gemini → Transcript
        Flux<WebSocketMessage> outbound = incomingPcm
                .flatMap(audioService::processPcmChunk)
                .map(resultText -> {
                    log.info("Sending transcript to frontend: {}", resultText);
                    return session.textMessage(resultText);
                });

        return session.send(outbound);
    }
}
