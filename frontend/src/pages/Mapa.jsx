import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { SEDES_2026 } from '../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for default marker icons in Leaflet + Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map center changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom]);
  return null;
};

export const Mapa = () => {
  const [selectedSede, setSelectedSede] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [mapConfig, setMapConfig] = useState({
    center: [39.8283, -98.5795], // Central North America
    zoom: 4
  });

  const fetchWeather = async (lat, lng, sedeId) => {
    try {
      const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);
      setWeatherData(prev => ({
        ...prev,
        [sedeId]: res.data.current
      }));
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const handleSedeClick = (sede) => {
    setSelectedSede(sede);
    setMapConfig({
      center: [sede.lat, sede.lng],
      zoom: 8
    });
    if (!weatherData[sede.id]) {
      fetchWeather(sede.lat, sede.lng, sede.id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-80 flex-col bg-surface border-r border-white/5 overflow-y-auto scrollbar-thin">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-black text-text">Sedes 2026</h2>
          <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">16 Ciudades Anfitrionas</p>
        </div>
        <div className="flex-1">
          {SEDES_2026.map(sede => (
            <button
              key={sede.id}
              onClick={() => handleSedeClick(sede)}
              className={`w-full p-4 flex items-center gap-4 text-left border-b border-white/5 transition-all hover:bg-white/5 ${
                selectedSede?.id === sede.id ? 'bg-primary/10 border-r-2 border-r-primary' : ''
              }`}
            >
              <span className="text-3xl">{sede.bandera}</span>
              <div>
                <div className="font-bold text-sm text-text">{sede.ciudad}</div>
                <div className="text-[10px] text-text-muted uppercase font-bold">{sede.estadio}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative">
        <MapContainer 
          center={mapConfig.center} 
          zoom={mapConfig.zoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          
          <ChangeView center={mapConfig.center} zoom={mapConfig.zoom} />

          {SEDES_2026.map(sede => (
            <Marker 
              key={sede.id} 
              position={[sede.lat, sede.lng]}
              eventHandlers={{
                click: () => handleSedeClick(sede)
              }}
            >
              <Popup className="custom-popup">
                <div className="w-64 p-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{sede.bandera}</span>
                    <div>
                      <div className="font-black text-text leading-none">{sede.ciudad}</div>
                      <div className="text-[10px] text-text-muted uppercase font-bold">{sede.pais}</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/5 mb-3">
                    <div className="text-xs font-bold text-primary mb-1">ESTADIO</div>
                    <div className="text-sm font-bold text-text mb-1">{sede.estadio}</div>
                    <div className="text-[10px] text-text-muted">Capacidad: {sede.capacidad}</div>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 rounded-lg p-3 border border-white/5">
                    <div>
                      <div className="text-[10px] font-bold text-text-muted mb-1 uppercase">Próximo Evento</div>
                      <div className="text-[10px] font-medium text-text leading-tight">{sede.proximoPartido}</div>
                    </div>
                    {weatherData[sede.id] && (
                      <div className="text-right border-l border-white/10 pl-3">
                        <div className="text-xs font-black text-gold">{weatherData[sede.id].temperature_2m}°C</div>
                        <div className="text-[8px] uppercase font-bold text-text-muted">Viento: {weatherData[sede.id].wind_speed_10m}km/h</div>
                        <div className="text-[8px] uppercase font-bold text-text-muted">Hum: {weatherData[sede.id].relative_humidity_2m}%</div>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Bottom Sheet - Mobile */}
        <div className="lg:hidden absolute bottom-4 left-4 right-4 z-[1000] bg-surface/90 backdrop-blur-md rounded-2xl border border-white/10 p-4 max-h-40 overflow-x-auto flex gap-4 no-scrollbar">
          {SEDES_2026.map(sede => (
            <button
              key={sede.id}
              onClick={() => handleSedeClick(sede)}
              className="shrink-0 w-40 p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center text-center"
            >
              <span className="text-2xl mb-1">{sede.bandera}</span>
              <div className="font-bold text-[10px] text-text truncate w-full">{sede.ciudad}</div>
              <div className="text-[8px] text-text-muted uppercase truncate w-full">{sede.estadio}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
