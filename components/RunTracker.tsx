import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, GeoPoint } from '../types';
import { storageService } from '../services/storageService';
import { Play, Pause, Square, MapPin, Footprints, Flame, Timer, Navigation, Signal } from 'lucide-react';

interface RunTrackerProps {
  user: UserProfile;
}

const RunTracker: React.FC<RunTrackerProps> = ({ user }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [path, setPath] = useState<GeoPoint[]>([]);
  const [distance, setDistance] = useState(0); // meters
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [steps, setSteps] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0); // km/h
  const [gpsStatus, setGpsStatus] = useState<'off' | 'searching' | 'locked'>('off');
  const [error, setError] = useState<string>('');

  const watchIdRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Haversine Formula for distance
  const getDistanceFromLatLonInM = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  };

  const drawRadarGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    const step = 40;
    for(let i=0; i<width; i+=step) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, height); ctx.stroke(); }
    for(let i=0; i<height; i+=step) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(width, i); ctx.stroke(); }

    // Crosshair center
    ctx.strokeStyle = '#3f3f46';
    ctx.beginPath(); ctx.moveTo(width/2, 0); ctx.lineTo(width/2, height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, height/2); ctx.lineTo(width, height/2); ctx.stroke();
  };

  useEffect(() => {
    let interval: any;
    
    // Initial draw
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) drawRadarGrid(ctx, canvasRef.current.width, canvasRef.current.height);
    }

    if (isTracking) {
      setGpsStatus('searching');
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      if (!navigator.geolocation) {
        setError('Geolocalização não suportada pelo navegador.');
        return;
      }

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setGpsStatus('locked');
          const { latitude, longitude, speed } = position.coords;
          const newPoint = { lat: latitude, lng: longitude, timestamp: Date.now() };

          setPath(prevPath => {
            if (prevPath.length > 0) {
              const lastPoint = prevPath[prevPath.length - 1];
              const distDelta = getDistanceFromLatLonInM(lastPoint.lat, lastPoint.lng, latitude, longitude);
              
              // Only update if moved significantly to reduce GPS noise
              // Lower threshold for "walking" apps
              if (distDelta > 1.5) { 
                setDistance(d => d + distDelta);
                setSteps(s => s + Math.floor(distDelta / 0.762));
                return [...prevPath, newPoint];
              }
              return prevPath;
            } else {
              return [newPoint];
            }
          });

          // Speed in m/s to km/h
          setCurrentSpeed(speed ? speed * 3.6 : 0);
        },
        (err) => {
          setError(`GPS Erro: ${err.message}`);
          setGpsStatus('off');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      setGpsStatus('off');
    }

    return () => {
      clearInterval(interval);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isTracking]);

  // Draw Path on Canvas (Radar View)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Always redraw background/grid
    drawRadarGrid(ctx, canvas.width, canvas.height);

    if (path.length === 0) return;

    // Determine bounds
    const lats = path.map(p => p.lat);
    const lngs = path.map(p => p.lng);
    let minLat = Math.min(...lats);
    let maxLat = Math.max(...lats);
    let minLng = Math.min(...lngs);
    let maxLng = Math.max(...lngs);

    // If only one point or points are too close, create a default zoom window
    if (maxLat === minLat) { maxLat += 0.0005; minLat -= 0.0005; }
    if (maxLng === minLng) { maxLng += 0.0005; minLng -= 0.0005; }

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;
    const padding = 60;

    const getX = (lng: number) => ((lng - minLng) / lngRange) * (canvas.width - padding * 2) + padding;
    const getY = (lat: number) => canvas.height - (((lat - minLat) / latRange) * (canvas.height - padding * 2) + padding);

    // Draw Path
    if (path.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#FBFF00';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(getX(path[0].lng), getY(path[0].lat));

      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(getX(path[i].lng), getY(path[i].lat));
      }
      ctx.stroke();
    }

    // Draw Current Position (Center if single point)
    const last = path[path.length-1];
    const curX = getX(last.lng);
    const curY = getY(last.lat);
    
    ctx.beginPath();
    ctx.fillStyle = '#FBFF00';
    ctx.arc(curX, curY, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Pulse effect ring
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(251, 255, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.arc(curX, curY, 12, 0, Math.PI * 2);
    ctx.stroke();

  }, [path]);

  const handleStop = () => {
    setIsTracking(false);
    
    const avgSpeed = elapsedTime > 0 ? (distance / 1000) / (elapsedTime / 3600) : 0;
    let met = 3.5;
    if (avgSpeed > 6) met = 7;
    if (avgSpeed > 9) met = 9;
    if (avgSpeed > 12) met = 11;
    
    const calories = Math.floor(met * user.weight * (elapsedTime / 3600));

    storageService.logWorkout(user.email, {
      date: new Date().toISOString(),
      exercisesCompleted: 1,
      caloriesBurned: calories,
      type: 'cardio',
      distance: parseFloat((distance/1000).toFixed(2)),
      duration: elapsedTime
    });

    alert(`CARDIO FINALIZADO.\nDistância: ${(distance/1000).toFixed(2)}km\nCalorias: ${calories}\nVocê está caçando sua melhor versão.`);
    
    // Reset
    setPath([]);
    setDistance(0);
    setElapsedTime(0);
    setSteps(0);
    setCurrentSpeed(0);
    setGpsStatus('off');
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours > 0 ? hours + ':' : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase flex items-center gap-2">
            <Footprints className="text-vengeance-yellow" />
            Rastreamento Tático
          </h2>
          <p className="text-gray-400">Corrida. Caminhada. Caça.</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          <Signal size={16} className={gpsStatus === 'locked' ? 'text-green-500' : gpsStatus === 'searching' ? 'text-yellow-500 animate-pulse' : 'text-gray-600'} />
          <span className="text-xs font-mono font-bold text-gray-400 uppercase">
            {gpsStatus === 'locked' ? 'GPS OK' : gpsStatus === 'searching' ? 'BUSCANDO...' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded flex flex-col items-center justify-center">
          <Navigation className="text-vengeance-yellow mb-2" />
          <span className="text-gray-400 text-xs uppercase font-bold">Distância</span>
          <span className="text-3xl font-black text-white font-mono">{(distance / 1000).toFixed(2)} <span className="text-sm text-gray-500">km</span></span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded flex flex-col items-center justify-center">
          <Timer className="text-vengeance-yellow mb-2" />
          <span className="text-gray-400 text-xs uppercase font-bold">Tempo</span>
          <span className="text-3xl font-black text-white font-mono">{formatTime(elapsedTime)}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded flex flex-col items-center justify-center">
          <Flame className="text-vengeance-yellow mb-2" />
          <span className="text-gray-400 text-xs uppercase font-bold">Velocidade</span>
          <span className="text-3xl font-black text-white font-mono">{currentSpeed.toFixed(1)} <span className="text-sm text-gray-500">km/h</span></span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded flex flex-col items-center justify-center">
          <Footprints className="text-vengeance-yellow mb-2" />
          <span className="text-gray-400 text-xs uppercase font-bold">Passos (Est.)</span>
          <span className="text-3xl font-black text-white font-mono">{steps}</span>
        </div>
      </div>

      {/* Map/Radar */}
      <div className="relative w-full h-64 bg-black rounded border border-zinc-700 overflow-hidden group">
        <div className="absolute top-2 left-2 z-10 bg-black/50 px-2 py-1 rounded text-[10px] text-vengeance-yellow border border-vengeance-yellow/30 font-mono flex items-center gap-2">
          MAPA DE CALOR :: LAT/LONG
        </div>
        
        <canvas ref={canvasRef} width={600} height={300} className="w-full h-full object-cover" />

        {/* Instructions Overlay */}
        {!isTracking && path.length === 0 && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest bg-black/80 px-4 py-2 rounded">
               Aguardando sinal de satélite
             </p>
           </div>
        )}
      </div>

      {error && <div className="text-red-500 text-sm font-bold bg-red-900/20 p-2 rounded border border-red-900">{error}</div>}

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4">
        {!isTracking ? (
          <button 
            onClick={() => setIsTracking(true)}
            className="bg-vengeance-yellow hover:bg-yellow-400 text-black font-black py-6 rounded uppercase text-xl tracking-widest flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(251,255,0,0.3)] transition-transform hover:scale-[1.01]"
          >
            <Play fill="black" /> Iniciar Perseguição
          </button>
        ) : (
          <button 
            onClick={handleStop}
            className="bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded uppercase text-xl tracking-widest flex justify-center items-center gap-3 animate-pulse"
          >
            <Square fill="white" /> Encerrar Missão
          </button>
        )}
      </div>
    </div>
  );
};

export default RunTracker;