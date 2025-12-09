import { GoogleGenAI } from "@google/genai";

// Initialize with environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDietPlan = async (ingredients: string, userGoal: string) => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Você é um nutricionista esportivo "casca grossa" e focado em resultados extremos.
    O usuário quer perder barriga rápido (meta: Natal).
    
    Ingredientes disponíveis na despensa do usuário: ${ingredients}
    Objetivo do usuário: ${userGoal}
    
    Crie um plano de refeições (Café, Almoço, Jantar, Lanche) usando APENAS ou PRINCIPALMENTE esses ingredientes.
    Se faltar proteína, mande ele comprar ovos ou frango (coisas baratas).
    O tom deve ser motivacional, direto, sem frescura. Diga os macros estimados se possível.
    
    Formate a resposta usando Markdown limpo.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar dieta:", error);
    return "Erro ao conectar com a inteligência artificial. Verifique sua chave de API ou tente novamente mais tarde.";
  }
};

export const generateDailyMotivation = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Gere uma frase curta, agressiva e motivacional para alguém treinando por vingança amorosa/superação. Max 20 palavras. Em Português.",
    });
    return response.text;
  } catch (e) {
    return "O silêncio é a melhor resposta. O sucesso é o melhor barulho.";
  }
}
