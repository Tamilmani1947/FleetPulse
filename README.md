# FleetPulse

**FleetPulse** is a high-performance, live GPS command center designed for real-time fleet tracking and monitoring. It features a reactive dashboard that visualizes asset movement on a global map, powered by a lightweight Flask backend and a modern React frontend.

#  Live Access

- Access the command center across your local network or via the production engine:

- **Frontend Terminal:** index.html (Local / Hosted via Dev Tunnels)

- **Live Demo** [Click here](https://tamilmani1947.github.io/FleetPulse/).

#  Key Features

## Real-time Synchronization

- Assets update every 3 seconds to ensure precision tracking. The map engine utilizes smooth marker transitions to reflect the latest telemetry data without jarring jumps.

## Bi-directional Feedback

- **Go Live (Broadcast Mode):** Turn any mobile device into a tracking unit. By clicking "Share Location," your coordinates are broadcasted to the central radar as an active terminal.

- **Asset Focus:** Interactive map markers. Click any unit to pull up a glass-morphic detail panel showing live velocity, signal health, and unique telemetry IDs.


## Cleanup

- The backend features a Stale Signal Detector. If a vehicle stops transmitting for more than 20 seconds, it is automatically purged from the active radar to keep the command center clean and relevant.

# Command Center UI

- **Dark Matter Mapping:** Utilizes CartoDB Dark Matter tiles for a premium, low-strain visual experience.

- **Glass-morphism:** Modern UI panels featuring backdrop-blur effects, indigo accents, and high-contrast typography.

# Technical Architecture

**Backend (Python/Flask)**

- API Layer: RESTful endpoints (/api/vehicles, /api/update) for high-frequency state management.

- State Management: High-speed In-memory store for real-time responsiveness without disk I/O latency.

- CORS Policy: Fully configured for cross-origin requests, enabling seamless communication between mobile devices and the central dashboard.

**Frontend (React/Leaflet)**

- Map Engine: Leaflet.js for high-performance geospatial rendering.

- Styling: Tailwind CSS for a responsive, utility-first design.

- Iconography: Lucide React for crisp, scalable vector icons.

Project Structure
```
├── app.py              # Flask Backend API (Logic & In-Memory State)
├── index.html          # Core Frontend (React + Leaflet + Tailwind)
├── App.js              # Modular React Component logic (Reference)
└── README.md           # Project documentation
```

# Installation & Setup

# 1. Backend Environment

Ensure you have Python installed. Then, initialize the micro-services:

```
## Install dependencies
pip install flask flask-cors

# Start the server
python app.py
```

- The server will initialize at `http://127.0.0.1:5000.`

# 2. Frontend Deployment

The frontend is a single-file React application for maximum portability.

- Open `index.html` in any modern web browser.

- Configuration: If running locally, ensure the API_BASE_URL in index.html points to your local Flask instance:
  `const API_BASE_URL = "http://127.0.0.1:5000";`

# Author

[Tamilmani](https://github.com/Tamilmani1947/) — Developing tools for the future of logistics.

Stay connected. Stay tracked. FleetPulse.
