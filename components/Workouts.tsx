import React, { useState } from 'react';
import { EXERCISE_DB, TRAINING_PLAN } from '../constants';
import { UserProfile, Exercise } from '../types';
import { storageService } from '../services/storageService';
import { Play, CheckCircle, Clock, RotateCcw, StopCircle, Youtube, ChevronDown, Calendar, Lock, X } from 'lucide-react';

interface WorkoutsProps {
  user: UserProfile;
}

const ExerciseTimer = ({ id }: { id: string }) => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<any>(null);

  const toggle = () => {
    if (running) {
      clearInterval(timerInterval);
      setRunning(false);
    } else {
      const interval = setInterval(() => setTime(t => t + 1), 1000);
      setTimerInterval(interval);
      setRunning(true);
    }
  };

  const reset = () => {
    clearInterval(timerInterval);
    setRunning(false);
    setTime(0);
  };

  const format = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="mt-4 flex items-center gap-2 bg-black/40 p-2 rounded w-fit">
      <Clock size={16} className="text-vengeance-yellow" />
      <span className="font-mono text-white font-bold w-12">{format(time)}</span>
      <button onClick={toggle} className="p-1 hover:bg-zinc-700 rounded text-gray-300">
        {running ? <StopCircle size={18} className="text-red-500" /> : <Play size={18} className="text-green-500" />}
      </button>
      <button onClick={reset} className="p-1 hover:bg-zinc-700 rounded text-gray-300">
        <RotateCcw size={18} />
      </button>
    </div>
  );
};

const Workouts: React.FC<WorkoutsProps> = ({ user }) => {
  const [activeWorkout, setActiveWorkout] = useState<boolean>(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<any>(null);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  
  // Schedule state
  const weekKeys = Object.keys(TRAINING_PLAN);
  const [selectedWeek, setSelectedWeek] = useState<string>(weekKeys[0]);
  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const currentDayName = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]; // Adjust for JS Sunday=0
  const [selectedDay, setSelectedDay] = useState<string>(currentDayName);

  const startWorkout = () => {
    setActiveWorkout(true);
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    setIntervalId(id);
  };

  const finishWorkout = () => {
    if (intervalId) clearInterval(intervalId);
    setActiveWorkout(false);
    setExpandedVideo(null);
    
    // Save log
    const calories = completedExercises.length * 60; // Slightly higher estimate for calisthenics
    storageService.logWorkout(user.email, {
      date: new Date().toISOString(),
      exercisesCompleted: completedExercises.length,
      caloriesBurned: calories,
      type: 'strength',
      duration: timer
    });

    alert(`MISSÃO CUMPRIDA.\nCalorias: ${calories}\nSem dor, sem resultado.`);
    setCompletedExercises([]);
    setTimer(0);
  };

  const toggleExercise = (id: string) => {
    if (completedExercises.includes(id)) {
      setCompletedExercises(completedExercises.filter(ex => ex !== id));
    } else {
      setCompletedExercises([...completedExercises, id]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleVideo = (id: string) => {
    if (expandedVideo === id) {
      setExpandedVideo(null);
    } else {
      setExpandedVideo(id);
    }
  };

  // Get exercises for current selection
  const dailyPlanRaw = TRAINING_PLAN[selectedWeek][selectedDay as keyof typeof TRAINING_PLAN[string]] || [];
  
  const isRestDay = dailyPlanRaw.length === 1 && dailyPlanRaw[0] === "Descanso";
  const isCardioDay = dailyPlanRaw.length === 1 && dailyPlanRaw[0].startsWith("Cardio");

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="border-b border-zinc-800 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase">Protocolo Calistenia</h2>
            <p className="text-gray-400 text-sm">Construa o corpo que ela vai se arrepender de ter deixado.</p>
          </div>
          
          {!activeWorkout ? (
            <button 
              onClick={startWorkout}
              disabled={isRestDay}
              className={`bg-vengeance-yellow hover:bg-yellow-400 text-black font-black px-6 py-3 rounded uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 ${isRestDay ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Play size={20} fill="black" /> {isRestDay ? "Descanso" : "Iniciar Treino"}
            </button>
          ) : (
            <div className="flex items-center gap-4">
               <div className="bg-zinc-800 px-4 py-2 rounded text-vengeance-yellow font-mono text-xl flex items-center gap-2">
                  <Clock size={20} />
                  {formatTime(timer)}
               </div>
               <button 
                onClick={finishWorkout}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded uppercase"
              >
                Finalizar
              </button>
            </div>
          )}
        </div>

        {/* Filters / Selectors */}
        <div className="space-y-4">
          {/* Week Selector */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin">
            {weekKeys.map(week => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`whitespace-nowrap px-4 py-2 rounded font-bold text-xs uppercase border ${
                  selectedWeek === week 
                    ? 'bg-zinc-800 border-vengeance-yellow text-vengeance-yellow' 
                    : 'bg-black border-zinc-800 text-gray-500 hover:border-gray-600'
                }`}
              >
                {week.split(':')[0]}
              </button>
            ))}
          </div>

          {/* Day Selector */}
          <div className="flex justify-between md:justify-start gap-1 bg-zinc-900/50 p-1 rounded-lg overflow-x-auto">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 md:flex-none px-4 py-2 rounded text-xs font-bold uppercase transition-colors ${
                  selectedDay === day 
                    ? 'bg-vengeance-yellow text-black' 
                    : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Title of Plan */}
      <div className="bg-zinc-900 border-l-4 border-vengeance-yellow p-4 rounded-r flex justify-between items-center">
        <div>
          <h3 className="text-vengeance-yellow font-bold uppercase text-xs tracking-widest">{selectedWeek}</h3>
          <h4 className="text-white font-black text-xl uppercase">{selectedDay}</h4>
        </div>
        {isRestDay && <div className="text-zinc-500 font-mono text-sm uppercase px-4 border border-zinc-700 rounded">Recuperação Muscular</div>}
      </div>

      {/* Workout Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isRestDay ? (
           <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-800 rounded-lg">
             <Calendar size={48} className="mx-auto text-zinc-700 mb-4" />
             <h3 className="text-2xl font-bold text-zinc-500 uppercase">Dia de Descanso</h3>
             <p className="text-zinc-600 mt-2">O músculo cresce no descanso. Coma bem e durma.</p>
           </div>
        ) : isCardioDay ? (
           <div className="col-span-full py-12 text-center bg-zinc-900 rounded-lg border border-zinc-800">
             <div className="animate-pulse">
               <Play size={48} className="mx-auto text-vengeance-yellow mb-4" />
             </div>
             <h3 className="text-2xl font-bold text-white uppercase">{dailyPlanRaw[0]}</h3>
             <p className="text-gray-400 mt-2 max-w-md mx-auto">
               Vá para a aba "Cardio" no menu para rastrear sua corrida com GPS e velocidade.
             </p>
           </div>
        ) : (
          dailyPlanRaw.map((itemId: string) => {
            // Check if item is in DB, otherwise it might be a custom string
            const exercise = EXERCISE_DB[itemId];
            if (!exercise) return null;

            const isSelected = completedExercises.includes(exercise.id);
            const isVideoOpen = expandedVideo === exercise.id;

            return (
              <div 
                key={exercise.id} 
                className={`p-6 rounded-lg border-2 transition-all relative group flex flex-col ${
                  isSelected 
                    ? 'bg-zinc-900/50 border-vengeance-yellow/50' 
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {/* Header */}
                <div 
                  className="flex justify-between items-start mb-2 cursor-pointer"
                  onClick={() => activeWorkout && toggleExercise(exercise.id)}
                >
                  <h3 className={`text-xl font-bold ${isSelected ? 'text-vengeance-yellow line-through opacity-50' : 'text-white'}`}>
                    {exercise.name}
                  </h3>
                  {isSelected ? <CheckCircle className="text-vengeance-yellow" /> : <div className="w-6 h-6 rounded-full border border-zinc-600" />}
                </div>
                
                {/* Tags */}
                <div className="flex gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${exercise.difficulty === 'Avançado' ? 'bg-red-900 text-red-100' : 'bg-zinc-800 text-gray-300'}`}>
                    {exercise.difficulty}
                  </span>
                  <span className="text-[10px] font-bold bg-zinc-800 text-gray-300 px-2 py-1 rounded uppercase">
                    {exercise.target}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{exercise.description}</p>
                
                {/* Video Embed Section */}
                {isVideoOpen && exercise.videoId && (
                  <div className="mb-4 w-full bg-black rounded overflow-hidden border border-zinc-700 aspect-video animate-fade-in relative">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${exercise.videoId}?autoplay=1&rel=0&origin=${window.location.origin}`} 
                      title={exercise.name}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto">
                  <div className="bg-black p-2 rounded border border-zinc-800 w-full sm:w-auto text-center">
                    <span className="text-vengeance-yellow font-mono font-bold text-sm block sm:inline">META: {exercise.reps}</span>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
                     {/* Video Toggle Button */}
                    {exercise.videoId && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleVideo(exercise.id); }}
                        className={`p-2 rounded flex items-center gap-2 text-xs font-bold uppercase transition-colors ${
                          isVideoOpen 
                            ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700' 
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                        title={isVideoOpen ? "Fechar Vídeo" : "Ver Vídeo"}
                      >
                        {isVideoOpen ? <X size={16} /> : <Youtube size={16} />}
                        {isVideoOpen ? "Fechar" : "Vídeo"}
                      </button>
                    )}
                    
                    {/* Timer */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <ExerciseTimer id={exercise.id} />
                    </div>
                  </div>
                </div>

                {!activeWorkout && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px] rounded-lg z-10">
                    <div className="flex items-center gap-2 text-gray-400 font-mono text-xs uppercase bg-black px-3 py-1 rounded border border-zinc-800">
                      <Lock size={12} /> Inicie o treino
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Workouts;