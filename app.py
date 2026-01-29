import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import time
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, methods=["GET", "POST", "DELETE", "OPTIONS"])

DATA_FILE = 'fleet_data.json'
STALE_TIMEOUT_MS = 20000

def load_data():
    if not os.path.exists(DATA_FILE):
        return {}
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except Exception:
        return {}

def save_data(data):
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        print(f"Error saving data: {e}")

@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    data = load_data()
    now = int(time.time() * 1000)
    
    active_vehicles = {}
    changed = False
    
    for v_id, v_info in data.items():
        if now - v_info.get('lastUpdate', 0) < STALE_TIMEOUT_MS:
            active_vehicles[v_id] = v_info
        else:
            print(f"--- AUTO-CLEANUP: Removing {v_info.get('name', v_id)}")
            changed = True
            
    if changed:
        save_data(active_vehicles)
        
    return jsonify(list(active_vehicles.values()))

@app.route('/api/update', methods=['POST'])
def update_vehicle():
    v_data = request.json
    v_id = v_data.get('id')
    v_name = v_data.get('name', 'Unknown Unit')
    
    if not v_id:
        return jsonify({"error": "No ID provided"}), 400
    
    current_data = load_data()
    v_data['lastUpdate'] = int(time.time() * 1000)
    current_data[v_id] = v_data
    save_data(current_data)
    print(f"--- UPDATE: {v_name} is at {v_data.get('lat')}, {v_data.get('lng')}")
    return jsonify({"status": "success", "id": v_id})

@app.route('/api/remove/<v_id>', methods=['DELETE'])
def remove_vehicle(v_id):
    """Explicitly remove a vehicle from the JSON file."""
    current_data = load_data()
    if v_id in current_data:
        name = current_data[v_id].get('name', v_id)
        del current_data[v_id]
        save_data(current_data)
        print(f"--- SUCCESS: {name} stopped sharing.")
        return jsonify({"status": "removed"})
    
    return jsonify({"status": "not_found"}), 404

if __name__ == '__main__':
    print(f"\n" + "="*40)
    print(f"FLEETPULSE COMMAND CENTER ACTIVE")
    print(f"Port: 5000 | Mode: Multi-User Identification")
    print(f"="*40 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=True)