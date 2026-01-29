# FleetPulse 🚛 🛰️

FleetPulse is a high-performance, live GPS command center designed for real-time fleet tracking and monitoring. It features a reactive dashboard that visualizes asset movement on a global map, powered by a Flask backend and a modern React frontend.

🚀 Live Access

Access the command center here:

Frontend: index.html (Local/Hosted)

Production API: https://fleetpulse-7xbu.onrender.com

✨ Features

Real-time Synchronization: Assets update every 3 seconds to ensure precision tracking.

Bi-directional Feedback:

Go Live: Broadcast your own location as an "Admin Terminal" directly to the map.

Asset Focus: Click any unit to view detailed velocity and signal status.

Auto-Cleanup Logic: Stale signals are automatically removed from the radar after 20 seconds of inactivity.

Dark Mode UI: A premium, "glass-morphic" interface designed for low-light command centers.

Cross-Platform: Works across web browsers and mobile terminals via geolocation API.

🛠️ Technical Architecture

Backend (Python/Flask)

RESTful API: Handles asset updates, retrieval, and explicit removals.

JSON Persistence: Uses fleet_data.json for lightweight, fast data storage.

CORS Enabled: Configured for cross-origin resource sharing for seamless frontend integration.

Frontend (React/Leaflet)

Map Engine: Leaflet.js with CartoDB Dark Matter tiles.

UI Framework: Tailwind CSS for responsive, modern styling.

Icons: Lucide React for crisp, vector-based asset visualization.

📂 Project Structure

├── app.py              # Flask Backend API
├── index.html          # React Frontend (CDN based)
├── fleet_data.json     # Live Data Store (Auto-generated)
└── App.js              # Legacy React Component logic


⚙️ Installation & Setup

1. Backend Setup

# Install dependencies
pip install flask flask-cors

# Run the server
python app.py


The server will start at http://127.0.0.1:5000.

2. Frontend Setup

Simply open index.html in any modern web browser.

Note: Ensure the API_BASE_URL in index.html is pointing to your active backend (Localhost or Render).

🤝 Contributing

Fork the Project.

Create your Feature Branch (git checkout -b feature/NewAssetIcon).

Commit your Changes.

Push to the Branch.

Open a Pull Request.

👨‍💻 Author

Tamilmani Developing tools for the future of logistics.

Stay connected. Stay tracked. FleetPulse.
