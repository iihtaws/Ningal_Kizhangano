<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />

# Ningal Kizhangano 🎯

## Basic Details
### Team Name: Potato

### Team Members
- Team Lead: Pavan Sajeev K K - CUSAT
- Member 2: Swathi T - CUSAT

### Project Description
Everything in this world is either a potato or a lookalike of potato... This website helps you find your or any object's resemblance with a potato using deep learning computer vision!

### The Problem (that doesn't exist)
The problem is to find which object is a potato (which is obvious), but more importantly, mathematically determine *how much* an object resembles a potato down to the starch percentage and earthiness factor.

### The Solution (that nobody asked for)
We calculate the resemblance percentage using OpenAI's CLIP zero-shot neural network model, displaying hilarious spud verdicts, detailed starch metrics, and keeping a global potato leaderboard gallery!

---

## Technical Details

### Technologies/Components Used

#### For Software:
- **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons, HTML5 Canvas / MediaDevices API (Webcam)
- **Backend API Gateway:** Node.js, Express.js, Multer (Image handling), Mongoose
- **Database:** MongoDB (with resilient in-memory store fallback)
- **Machine Learning Engine:** Python 3.9+, FastAPI, PyTorch, Hugging Face Transformers (`openai/clip-vit-base-patch32`), Pillow (PIL)
- **API Communication:** Axios
- **Deployment:** Render / Hugging Face Spaces / Vercel

---

### Implementation

The project is implemented using a decoupled architecture consisting of a React frontend, Node.js Express API gateway, MongoDB database, and a FastAPI Machine Learning engine powered by Hugging Face CLIP.

#### System Architecture Workflow

```mermaid
graph TD
    A[React Frontend App] -->|Upload File / Capture Webcam| B[Node.js Express Backend]
    B -->|Proxy Image Payload| C[FastAPI ML Service]
    C -->|Zero-Shot Vision Analysis| D[Hugging Face CLIP: openai/clip-vit-base-patch32]
    D -->|Similarity Tensor & Weight Matrix| C
    C -->|Return Score, Badge & Breakdown| B
    B -->|Store Analysis Record| E[(MongoDB / Memory Store)]
    B -->|Send Response| A
    A -->|Display Animated Scanner & Score Gauge| A
```

---

# Installation & Setup Commands

### Prerequisites
- **Node.js**: v18+ and `npm`
- **Python**: 3.9+ and `pip`
- **MongoDB**: (Optional) Running locally on `mongodb://localhost:27017`

---

### Step 1: Start Python ML Service (FastAPI + PyTorch CLIP)

```bash
cd ml-service
pip install -r requirements.txt
python main.py
```
*The ML Service will launch on `http://localhost:8000`.*

---

### Step 2: Start Node.js Express Backend API Gateway

```bash
cd backend
npm install
npm run dev
```
*The Backend API will launch on `http://localhost:5000`.*

---

### Step 3: Start React Frontend Application

```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:3000` in your web browser!*

---

### ⚡ 1-Click Batch Launcher (Windows)

To start all services concurrently with a single command, execute:

```cmd
start-all.bat
```

---

## Project Documentation

### For Software:

#### Screenshots

<img width="969" height="3368" alt="useless" src="https://github.com/user-attachments/assets/c8cc83b8-7c2d-47fd-b864-9b83071a1781" />

*Opening Landing Page of **Ningal Kizhangano** introducing the scanner UI, live camera trigger, and sample presets.*

---

<img width="966" height="3026" alt="usel" src="https://github.com/user-attachments/assets/cfcf14e3-1a45-4b3e-91a8-a0f18a854afc" />

*Home Page - Testing potato resemblance in real-time using webcam stream.*

---

<img width="966" height="2919" alt="use" src="https://github.com/user-attachments/assets/82953479-dccd-4a54-9322-9bc90f6efb27" />

*Home Page - Testing using image upload showing Potato-O-Meter score, spud verdict badge, and attribute breakdown (Earthiness, Texture, Starch Index, Roundness).*

---

<img width="1901" height="907" alt="Screenshot 2026-09-13 105203" src="https://github.com/user-attachments/assets/b8bcea27-92a5-4596-8ee6-573a3b06ffe6" />

*Global Spud Leaderboard & History Gallery displaying past scans, similarity ratings, and full inspection modal.*

---

#### Diagrams

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as React + Vite Frontend
    participant Backend as Express API Gateway
    participant ML as FastAPI ML Service (PyTorch)
    participant DB as MongoDB Database

    User->>Frontend: Select Image / Capture Webcam
    Frontend->>Backend: POST /api/analyze (FormData)
    Backend->>ML: POST /predict (Image File)
    ML->>ML: Run CLIP Zero-Shot Prompting (openai/clip-vit-base-patch32)
    ML-->>Backend: Return Similarity %, Verdict, Breakdown
    Backend->>DB: Save Analysis Record & Score
    Backend-->>Frontend: Return Analysis Result JSON
    Frontend-->>User: Render Gauge Animation, Metrics & Verdict
```
*Sequence Diagram showing end-to-end data flow during image analysis.*

---

### For Hardware:
*N/A - This project is entirely software-based.*

---

## Project Demo

### Video
[Watch Project Demo Video]https://drive.google.com/file/d/1ORz3q2Wsl190Hh6mX44_pVkh9Et8O83Y/view?usp=drivesdk
*Demonstrates live webcam scanning, image upload analysis, CLIP neural net inference, real-time score radial gauge animation, attribute breakdown, and leaderboard persistence.*

### Additional Demos
- **Live Local Setup:** Run `start-all.bat` on Windows to test instantly.
- **Pre-loaded Samples:** Test with built-in potato, cat, apple, and fries presets.

---

## Team Contributions

- **Pavan Sajeev K K**: Integrated Hugging Face CLIP (`openai/clip-vit-base-patch32`) zero-shot classification model in Python FastAPI, developed spud similarity scoring algorithms & attribute calculation heuristics (Earthiness, Starch Index, Roundness Factor), built the Node.js / Express API gateway with Multer image upload & MongoDB integration.
- **Swathi T**: Designed and developed the React + Vite frontend UI using Tailwind CSS, implemented real-time webcam video stream capture & file drag-and-drop uploader, created the animated radial score meter, laser sweep scan animation, and the interactive global leaderboard history modal.

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)
