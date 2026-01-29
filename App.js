import React, { useState, useEffect, useMemo } from 'react';
import { 
  Truck, Navigation, Activity, Battery, Smartphone, 
  Download, Database, Search, Radio, Wifi 
} from 'lucide-react';

const API_BASE_URL = "https://k6shrp3z-5000.inc1.devtunnels.ms/"; 

const App = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [myId] = useState(() => "mobile-" + Math.random().toString(36).substr(2, 9));
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/vehicles`);
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let watchId;
    if (isTransmitting) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude, speed } = position.coords;
            try {
              await fetch(`${API_BASE_URL}/api/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: myId,
                  name: "Mobile Unit",
                  type: "Mobile",
                  lat: latitude,
                  lng: longitude,
                  status: "Active",
                  speed: Math.round((speed || 0) * 3.6),
                  battery: 100,
                  isOwner: true
                })
              });
              setStatus("Transmitting...");
            } catch (err) {
              setStatus("Upload Failed");
            }
          },
          () => setStatus("GPS Denied"),
          { enableHighAccuracy: true }
        );
      }
    } else {
      setStatus("Idle");
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, [isTransmitting, myId]);

  const mapBounds = useMemo(() => {
    if (vehicles.length === 0) return { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 };
    const buffer = 0.005;
    const lats = vehicles.map(v => v.lat);
    const lngs = vehicles.map(v => v.lng);
    return {
      minLat: Math.min(...lats) - buffer,
      maxLat: Math.max(...lats) + buffer,
      minLng: Math.min(...lngs) - buffer,
      maxLng: Math.max(...lngs) + buffer
    };
  }, [vehicles]);

  const project = (lat, lng) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = (1 - (lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col p-6 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg"><Navigation size={20}/></div>
          <h1 className="text-xl font-bold">LocalFleet</h1>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Server Status</span>
            <div className={`w-2 h-2 rounded-full ${status === "Idle" ? 'bg-slate-500' : 'bg-green-500 animate-pulse'}`} />
          </div>
          <p className="text-[10px] text-slate-500">Your phone sends GPS to your laptop via VS Code Dev Tunnel.</p>
          <button 
            onClick={() => setIsTransmitting(!isTransmitting)}
            className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
              isTransmitting ? 'bg-red-500/20 text-red-400' : 'bg-indigo-600 text-white'
            }`}
          >
            {isTransmitting ? 'STOP TRANSMITTING' : 'START TRANSMITTING'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Live Fleet</span>
          {vehicles.map(v => (
            <div 
              key={v.id}
              onClick={() => setSelectedVehicleId(v.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedVehicleId === v.id ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-800/40 border-transparent hover:bg-slate-800'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold truncate">{v.name}</span>
                <span className="text-[10px] text-slate-500">{v.speed} km/h</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <svg className="absolute inset-0 w-full h-full p-20">
          {vehicles.map(v => {
            const { x, y } = project(v.lat, v.lng);
            return (
              <g key={v.id} onClick={() => setSelectedVehicleId(v.id)} className="cursor-pointer">
                <circle cx={x} cy={y} r="6" className={v.isOwner ? "fill-orange-500" : "fill-indigo-400"} />
                <text x={x} y={y} dy="-15" textAnchor="middle" className="text-[10px] fill-slate-400 font-bold uppercase">{v.name}</text>
              </g>
            );
          })}
        </svg>

        {selectedVehicle && (
          <div className="absolute bottom-10 left-10 right-10 bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-700 shadow-2xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-600 rounded-2xl"><Truck size={32}/></div>
              <div>
                <h2 className="text-xl font-bold">{selectedVehicle.name}</h2>
                <p className="text-xs text-slate-500">{selectedVehicle.lat.toFixed(4)}, {selectedVehicle.lng.toFixed(4)}</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div><p className="text-[10px] text-slate-500 uppercase font-bold">Speed</p><p className="text-lg font-bold">{selectedVehicle.speed} km/h</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase font-bold">Storage</p><p className="text-lg font-bold">Local JSON</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;