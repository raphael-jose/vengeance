import React, { useState } from 'react';
import { UserProfile } from '../types';
import Dashboard from './Dashboard';
import Workouts from './Workouts';
import PantryChef from './PantryChef';
import Profile from './Profile';
import RunTracker from './RunTracker';
import { Dumbbell, LayoutDashboard, Utensils, User, Footprints } from 'lucide-react';

interface LayoutProps {
  user: UserProfile;
  onLogout: () => void;
  onUpdateUser: (u: UserProfile) => void;
}

type View = 'dashboard' | 'workout' | 'cardio' | 'diet' | 'profile';

const Layout: React.FC<LayoutProps> = ({ user, onLogout, onUpdateUser }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'workout': return <Workouts user={user} />;
      case 'cardio': return <RunTracker user={user} />;
      case 'diet': return <PantryChef user={user} />;
      case 'profile': return <Profile user={user} onUpdate={onUpdateUser} onLogout={onLogout} />;
      default: return <Dashboard user={user} />;
    }
  };

  const NavButton = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center py-4 px-2 w-full transition-colors border-t-2 ${
        currentView === view 
          ? 'border-vengeance-yellow text-vengeance-yellow bg-zinc-900' 
          : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-zinc-900'
      }`}
    >
      <Icon size={24} className="mb-1" />
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-vengeance-yellow selection:text-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-vengeance-yellow rounded flex items-center justify-center">
              <span className="text-black font-black text-xl">V</span>
            </div>
            <h1 className="font-black italic text-xl tracking-tighter">
              PROTOCOLO<span className="text-vengeance-yellow">VINGANÇA</span>
            </h1>
          </div>
          <div className="text-xs text-gray-500 hidden sm:block">
            {user.email}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 pb-24 sm:pb-8">
        {renderView()}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-black border-t border-zinc-800 sm:hidden z-50">
        <div className="flex justify-between">
          <NavButton view="dashboard" icon={LayoutDashboard} label="Status" />
          <NavButton view="workout" icon={Dumbbell} label="Treino" />
          <NavButton view="cardio" icon={Footprints} label="Cardio" />
          <NavButton view="diet" icon={Utensils} label="Dieta" />
          <NavButton view="profile" icon={User} label="Perfil" />
        </div>
      </nav>
    </div>
  );
};

export default Layout;