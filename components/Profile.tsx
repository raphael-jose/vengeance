import React, { useState } from 'react';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { User, Save, Lock } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (u: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onLogout }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'gender' ? value : parseFloat(value) || value });
  };

  const handleSave = () => {
    const updatedUser = { ...formData };
    if (newPassword) {
      updatedUser.password = newPassword;
    }
    storageService.saveUser(updatedUser);
    onUpdate(updatedUser);
    setMsg('Perfil atualizado. Continue focado.');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="border-b border-zinc-800 pb-4 flex justify-between items-center">
        <h2 className="text-3xl font-black text-white uppercase flex items-center gap-3">
          <User className="text-vengeance-yellow" size={32} />
          Seus Dados
        </h2>
        <button onClick={onLogout} className="text-red-500 hover:text-red-400 font-bold underline text-sm">
          Sair
        </button>
      </div>

      <div className="bg-zinc-900 p-8 rounded border border-zinc-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
             <label className="block text-gray-500 text-xs uppercase font-bold mb-2">Peso Atual (kg)</label>
             <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-vengeance-yellow outline-none" />
          </div>
          <div>
             <label className="block text-gray-500 text-xs uppercase font-bold mb-2">Meta de Peso (kg)</label>
             <input type="number" name="targetWeight" value={formData.targetWeight} onChange={handleChange} className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-vengeance-yellow outline-none" />
          </div>
          <div>
             <label className="block text-gray-500 text-xs uppercase font-bold mb-2">Altura (cm)</label>
             <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-vengeance-yellow outline-none" />
          </div>
          <div>
             <label className="block text-gray-500 text-xs uppercase font-bold mb-2">Idade</label>
             <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-vengeance-yellow outline-none" />
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800">
           <h3 className="text-white font-bold flex items-center gap-2 mb-4">
             <Lock size={16} className="text-vengeance-yellow" /> Segurança
           </h3>
           <label className="block text-gray-500 text-xs uppercase font-bold mb-2">Nova Senha (Opcional)</label>
           <input 
             type="password" 
             value={newPassword} 
             onChange={(e) => setNewPassword(e.target.value)} 
             placeholder="Deixe em branco para manter a atual"
             className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-vengeance-yellow outline-none" 
            />
           <p className="text-xs text-zinc-600 mt-2">Senha mestre de recuperação: 123456</p>
        </div>

        {msg && <p className="text-vengeance-yellow font-bold text-center animate-pulse">{msg}</p>}

        <button 
          onClick={handleSave}
          className="w-full bg-vengeance-yellow hover:bg-yellow-400 text-black font-black py-4 rounded uppercase tracking-widest flex justify-center items-center gap-2"
        >
          <Save size={20} /> Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default Profile;
