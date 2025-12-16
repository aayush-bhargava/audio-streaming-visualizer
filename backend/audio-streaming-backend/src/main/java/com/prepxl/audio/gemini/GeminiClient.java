package com.prepxl.audio.gemini;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiClient {

    private final GeminiConfig config;

    private final WebClient client = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent")
            .build();

    public Mono<String> transcribeAudio(String base64Audio) {

        String body = """
        {
          "contents": [{
            "role": "user",
            "parts": [{
              "inlineData": {
                "mimeType": "audio/wav",
                "data": "%s"
              }
            }]
          }],
          "generationConfig": {
            "temperature": 0.1
          }
        }
        """.formatted(base64Audio);

        return client.post()
                .uri(uri -> uri.queryParam("key", config.apiKey).build())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .doOnNext(res -> log.info("Gemini Response: {}", res))
                .onErrorResume(err -> {
                    log.error("Gemini error: {}", err.getMessage());
                    return Mono.just("");
                });
    }
}