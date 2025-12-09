import React, { useState } from 'react';
import { generateDietPlan } from '../services/geminiService';
import { UserProfile } from '../types';
import { Utensils, Send, Loader2 } from 'lucide-react';

interface PantryChefProps {
  user: UserProfile;
}

const PantryChef: React.FC<PantryChefProps> = ({ user }) => {
  const [ingredients, setIngredients] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    const result = await generateDietPlan(
      ingredients, 
      `Perder peso rápido, peso atual: ${user.weight}kg, meta: ${user.targetWeight}kg`
    );
    setPlan(result || '');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
       <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-3xl font-black text-white italic uppercase flex items-center gap-3">
            <Utensils className="text-vengeance-yellow" size={32} />
            Combustível da Vingança
          </h2>
          <p className="text-gray-400 mt-2">
            Não tem dinheiro pra dieta cara? Digite o que tem na sua dispensa (arroz, ovo, atum, aveia...) e a IA vai montar sua dieta para secar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-vengeance-yellow uppercase">O que você tem em casa?</label>
            <textarea 
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Ex: 3 ovos, arroz branco, feijão, latas de atum, aveia, leite desnatado, bananas..."
              className="w-full h-40 bg-zinc-900 border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-vengeance-yellow transition-colors"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading || !ingredients}
              className="w-full bg-white hover:bg-gray-200 text-black font-black py-4 rounded uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              Gerar Dieta Brutal
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded p-6 min-h-[400px]">
            {plan ? (
              <div className="prose prose-invert prose-yellow max-w-none">
                <div className="whitespace-pre-line text-gray-300 font-mono text-sm leading-relaxed">
                  {plan}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-700">
                <Utensils size={64} className="mb-4 opacity-20" />
                <p>O plano aparecerá aqui.</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default PantryChef;
