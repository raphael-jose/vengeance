import React, { useEffect, useState } from 'react';
import { UserProfile } from './types';
import { storageService } from './services/storageService';
import Auth from './components/Auth';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (loggedUser: UserProfile) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-vengeance-yellow">Iniciando protocolo...</div>;

  return user ? (
    <Layout user={user} onLogout={handleLogout} onUpdateUser={setUser} />
  ) : (
    <Auth onLogin={handleLogin} />
  );
};

export default App;
