# 🎧 Audio Streaming Visualizer  
*A real-time microphone visualizer with backend audio pipeline integration*

## 🚀 Overview  
The **Audio Streaming Visualizer** is a full-stack real-time audio system built using:

- **Next.js (Frontend)** – Captures live microphone audio  
- **Canvas Visualizer** – Displays beautiful circular audio frequency animation  
- **WebSockets** – Streams PCM audio to a backend  
- **Spring Boot WebFlux (Backend)** – Receives audio chunks and pipes them into an AI processor  
- **Gemini AI Integration (Optional)** – Code included for audio transcription

This project was created for an academic/assignment submission and demonstrates a complete real-time audio streaming architecture.

---

## ✨ Features

### 🎨 Frontend
- Real-time circular audio frequency visualizer  
- AudioWorklet for low-latency PCM capture  
- WebSocket audio streaming  
- Responsive UI with TailwindCSS  
- Clean structured Next.js layout  
- Start/Stop microphone controls  

### 🛠 Backend
- Spring Boot 3 + Reactive WebFlux  
- Non-blocking WebSocket ingestion  
- Processes PCM chunks  
- Gemini API integration module included (optional)

### 🤖 AI Integration (Optional)
Backend already includes:
- `GeminiClient.java`  
- Streaming request/response structure  
- Transcript forwarding logic  

AI transcription can be enabled anytime by simply activating the client.

---

## 📁 Project Structure

audio-streaming-visualizer/
│
├── frontend/ # Next.js frontend
│ ├── app/
│ │ ├── page.tsx
│ │ ├── audio/
│ │ ├── lib/
│ │ └── VisualizerCanvas.tsx
│ └── public/
│ └── recorder-worklet.js
│
└── backend/ # Spring Boot backend
├── src/main/java/com/prepxl/audio/
│ ├── websocket/
│ ├── service/
│ ├── gemini/
│ └── AudioStreamingBackendApplication.java
├── resources/
│ └── application.yml
└── pom.xml



---

## 🧩 How It Works

### 1️⃣ Microphone → Browser  
AudioWorklet captures PCM16 audio samples.

### 2️⃣ Browser → WebSocket  
Frontend streams chunks through WebSocket as binary.

### 3️⃣ Backend WebSocket → Audio Service  
Spring WebFlux receives PCM and forwards it to processing pipeline.

### 4️⃣ (Optional) Gemini AI  
Backend can send base64 PCM chunks to Gemini for transcription.

### 5️⃣ Backend → Frontend Transcript  
Transcripts are pushed back via WebSocket for real-time display.

---

## 🛠 Installation & Setup

### **Frontend and Backend**
```bash
cd frontend
npm install
npm run dev
Runs on:
➡️ http://localhost:3000

cd backend
./mvnw clean install
./mvnw spring-boot:run
Runs on:
➡️ http://localhost:8080
