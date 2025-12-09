import React, { useState } from 'react';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { MASTER_PASSWORD } from '../constants';
import { Dumbbell, AlertTriangle } from 'lucide-react';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration additional fields
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!email || !password || !name || !height || !weight || !targetWeight) {
        setError('Preencha tudo. Sem preguiça.');
        return;
      }

      if (password === MASTER_PASSWORD) {
        setError('ERRO: Você não pode usar a senha mestre como sua senha pessoal. Escolha outra.');
        return;
      }

      const newUser: UserProfile = {
        email,
        password, // In a real app, hash this
        name,
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseInt(age),
        targetWeight: parseFloat(targetWeight),
        gender: 'male' // Default for this specific persona request
      };

      storageService.saveUser(newUser);
      onLogin(newUser);
    } else {
      const storedUser = storageService.getUser(email);
      
      if (!storedUser) {
        setError('Usuário não encontrado. Crie uma conta.');
        return;
      }

      // Check password OR master password
      if (storedUser.password === password || password === MASTER_PASSWORD) {
        // Update session
        storageService.saveUser(storedUser); // updates current user pointer
        onLogin(storedUser);
      } else {
        setError('Senha incorreta. Tente de novo ou use a mestra.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 rounded-lg shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-vengeance-yellow to-transparent"></div>

        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-vengeance-yellow rounded-full mb-4 shadow-[0_0_15px_rgba(251,255,0,0.5)]">
            <Dumbbell size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Protocolo <span className="text-vengeance-yellow">Vingança</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-mono">
            {isRegister ? "Comece sua transformação." : "Bem-vindo de volta ao inferno."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:border-vengeance-yellow outline-none transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:border-vengeance-yellow outline-none transition-colors"
              placeholder={isRegister ? "Crie uma senha" : "Sua senha (ou a mestra)"}
            />
          </div>

          {isRegister && (
            <div className="space-y-4 animate-fade-in-down">
              <div>
                <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Nome</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:border-vengeance-yellow outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Altura (cm)</label>
                  <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:border-vengeance-yellow outline-none" placeholder="175" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Peso (kg)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:border-vengeance-yellow outline-none" placeholder="85" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Idade</label>
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:border-vengeance-yellow outline-none" placeholder="25" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-500 mb-1">Meta (kg)</label>
                  <input type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:border-vengeance-yellow outline-none" placeholder="70" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-3 rounded flex items-center gap-2">
              <AlertTriangle className="text-red-500 shrink-0" size={16} />
              <p className="text-red-500 text-xs font-bold">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-vengeance-yellow hover:bg-yellow-400 text-black font-black uppercase py-4 rounded tracking-wider shadow-lg transform hover:scale-[1.02] transition-all"
          >
            {isRegister ? "Criar Protocolo" : "Acessar Sistema"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-gray-500 hover:text-white text-xs underline uppercase tracking-wide"
          >
            {isRegister ? "Já tem conta? Entrar" : "Não tem conta? Criar Protocolo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;