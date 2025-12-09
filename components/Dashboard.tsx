import React, { useEffect, useState } from 'react';
import { UserProfile, WorkoutLog } from '../types';
import { storageService } from '../services/storageService';
import { generateDailyMotivation } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, TrendingDown, Calendar, AlertCircle } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [imc, setImc] = useState<number>(0);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [motivation, setMotivation] = useState<string>("Carregando ódio...");
  const [daysToXmas, setDaysToXmas] = useState<number>(0);

  useEffect(() => {
    // Calculate IMC
    const heightM = user.height / 100;
    const calcImc = user.weight / (heightM * heightM);
    setImc(parseFloat(calcImc.toFixed(1)));

    // Load logs
    const history = storageService.getWorkoutLogs(user.email);
    setLogs(history);

    // Days to Xmas
    const today = new Date();
    const currentYear = today.getFullYear();
    const xmas = new Date(currentYear, 11, 25); // Month is 0-indexed
    if (today.getMonth() === 11 && today.getDate() > 25) {
      xmas.setFullYear(currentYear + 1);
    }
    const diffTime = Math.abs(xmas.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysToXmas(diffDays);

    // Motivation
    generateDailyMotivation().then(setMotivation);
  }, [user]);

  const getImcStatus = (imc: number) => {
    if (imc < 18.5) return { text: "Magreza", color: "text-blue-400" };
    if (imc < 24.9) return { text: "Normal", color: "text-vengeance-yellow" };
    if (imc < 29.9) return { text: "Sobrepeso", color: "text-orange-500" };
    return { text: "Obesidade", color: "text-red-600" };
  };

  const status = getImcStatus(imc);

  // Mock data for chart if empty
  const chartData = logs.length > 0 ? logs.map((l, i) => ({ 
    name: `Dia ${i+1}`, 
    cal: l.caloriesBurned 
  })) : [{name: 'Start', cal: 0}];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Motivational Banner */}
      <div className="bg-vengeance-dim-yellow bg-opacity-10 border-l-4 border-vengeance-yellow p-4 rounded-r">
        <h2 className="text-vengeance-yellow font-black uppercase text-sm tracking-widest mb-1">Status Mental</h2>
        <p className="text-white italic text-lg">"{motivation}"</p>
      </div>

      {/* Xmas Countdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar size={64} className="text-vengeance-yellow" />
          </div>
          <h3 className="text-gray-400 text-sm font-mono uppercase">Prazo Final (Natal)</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{daysToXmas}</span>
            <span className="text-vengeance-yellow font-bold">DIAS RESTANTES</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Para esfregar o sucesso na cara dela.</p>
        </div>

        {/* IMC Card */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertCircle size={64} className="text-white" />
          </div>
          <h3 className="text-gray-400 text-sm font-mono uppercase">Seu IMC Atual</h3>
          <div className="mt-2 flex items-baseline gap-4">
            <span className="text-4xl font-black text-white">{imc}</span>
            <span className={`text-xl font-bold ${status.color}`}>{status.text.toUpperCase()}</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 mt-4 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-green-500 via-vengeance-yellow to-red-600" 
               style={{ width: `${Math.min((imc / 40) * 100, 100)}%` }}
             ></div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-950 p-4 rounded border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-zinc-900 rounded-full text-vengeance-yellow">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase">Treinos Feitos</p>
            <p className="text-2xl font-bold">{logs.length}</p>
          </div>
        </div>
        <div className="bg-zinc-950 p-4 rounded border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-zinc-900 rounded-full text-vengeance-yellow">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase">Peso Inicial</p>
            <p className="text-2xl font-bold">{user.weight} kg</p>
          </div>
        </div>
        <div className="bg-zinc-950 p-4 rounded border border-zinc-800 flex items-center gap-4">
           <div className="p-3 bg-zinc-900 rounded-full text-white">
            <div className="font-black">TG</div>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase">Meta de Peso</p>
            <p className="text-2xl font-bold text-white">{user.targetWeight} kg</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <TrendingDown size={18} className="text-vengeance-yellow"/>
          Consistência de Calorias Queimadas
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" tick={{fill: '#666'}} />
              <YAxis stroke="#666" tick={{fill: '#666'}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#111', border: '1px solid #333', color: '#fff'}}
                itemStyle={{color: '#FBFF00'}}
              />
              <Line type="monotone" dataKey="cal" stroke="#FBFF00" strokeWidth={3} dot={{r: 4, fill: '#fff'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
