package com.prepxl.audio.gemini;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GeminiConfig {

    @Value("${gemini.api.key}")
    public String apiKey;
}
