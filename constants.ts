import { Exercise, TrainingPlan } from './types';

export const MASTER_PASSWORD = "123456";

// YouTube Video IDs for home calisthenics (Verified Embeddable IDs - P4P/Bowflex/etc)
export const EXERCISE_DB: Record<string, Exercise> = {
  'pushup': {
    id: 'pushup',
    name: 'Flexão de Braço Clássica',
    description: 'Mãos na largura dos ombros. Desça até o peito quase tocar o chão. Mantenha o corpo reto como uma tábua.',
    reps: '3 x 12-15',
    difficulty: 'Iniciante',
    target: 'Peito',
    videoId: 'IODxDxX7oi4' // P4P Pushups (Animated)
  },
  'diamond_pushup': {
    id: 'diamond_pushup',
    name: 'Flexão Diamante',
    description: 'Junte as mãos formando um diamante. Desça com os cotovelos rentes ao corpo. Foco total no tríceps.',
    reps: '3 x 8-12',
    difficulty: 'Intermediário',
    target: 'Braços',
    videoId: 'J0DnG1_S92I' // Scott Herman
  },
  'explosive_pushup': {
    id: 'explosive_pushup',
    name: 'Flexão Explosiva',
    description: 'Desça controlado e empurre o chão com máxima força para as mãos saírem do solo.',
    reps: '4 x 10',
    difficulty: 'Avançado',
    target: 'Peito',
    videoId: 'P1XbN6y-2lc' // P4P Explosive
  },
  'squat': {
    id: 'squat',
    name: 'Agachamento Livre',
    description: 'Pés na largura dos ombros. Costas retas. Desça até a coxa passar da linha do joelho.',
    reps: '4 x 20',
    difficulty: 'Iniciante',
    target: 'Pernas',
    videoId: 'mGvzVjuY8SY' // P4P Squat
  },
  'jump_squat': {
    id: 'jump_squat',
    name: 'Agachamento com Salto',
    description: 'Agache e suba explodindo em um salto vertical. Amorteca a queda suavemente.',
    reps: '4 x 15',
    difficulty: 'Intermediário',
    target: 'Pernas',
    videoId: 'CVaEhXotL7M' // P4P Jump Squat
  },
  'lunge': {
    id: 'lunge',
    name: 'Afundo (Passada)',
    description: 'Dê um passo à frente e desça o joelho de trás até quase tocar o chão. Alterne as pernas.',
    reps: '3 x 12 (cada perna)',
    difficulty: 'Iniciante',
    target: 'Pernas',
    videoId: 'QOVaHwm-Q6U' // P4P Lunge
  },
  'step_up': {
    id: 'step_up',
    name: 'Step Up (Cadeira)',
    description: 'Suba em uma cadeira firme ou banco usando apenas uma perna. Controle a descida.',
    reps: '3 x 12 (cada perna)',
    difficulty: 'Iniciante',
    target: 'Pernas',
    videoId: '9ZknG97i0K8' // Step Up (Generic)
  },
  'plank': {
    id: 'plank',
    name: 'Prancha Isométrica',
    description: 'Cotovelos no chão, corpo reto. Contraia glúteos e abdômen o máximo possível. Não deixe o quadril cair.',
    reps: '3 x 45-60s',
    difficulty: 'Iniciante',
    target: 'Abdomen',
    videoId: 'ASdvN_XEl_c' // P4P Plank
  },
  'leg_raise': {
    id: 'leg_raise',
    name: 'Elevação de Pernas',
    description: 'Deitado de costas, mãos sob o glúteo. Suba as pernas esticadas até 90 graus. Não toque o chão na volta.',
    reps: '3 x 15',
    difficulty: 'Intermediário',
    target: 'Abdomen',
    videoId: 'l4kQd9eWclE' // P4P Leg Raise
  },
  'mountain_climber': {
    id: 'mountain_climber',
    name: 'Mountain Climbers',
    description: 'Posição de flexão, traga os joelhos ao peito alternadamente em alta velocidade como se estivesse correndo.',
    reps: '3 x 45s',
    difficulty: 'Intermediário',
    target: 'Cardio',
    videoId: 'w2iTOneLPCY' // P4P Mountain Climber
  },
  'burpee': {
    id: 'burpee',
    name: 'Burpees da Morte',
    description: 'Agacha, chuta atrás, flexão (peito no chão), volta e salta com palmas acima da cabeça.',
    reps: '3 x 1min (Máximo)',
    difficulty: 'Avançado',
    target: 'Full Body',
    videoId: 'G277XjG68s0' // P4P Burpee
  },
  'dips_chair': {
    id: 'dips_chair',
    name: 'Mergulho no Banco/Cadeira',
    description: 'Mãos apoiadas num banco atrás, pernas esticadas. Desça o corpo dobrando os cotovelos.',
    reps: '3 x 15',
    difficulty: 'Iniciante',
    target: 'Braços',
    videoId: 's305p4x45-Y' // Chair Dips
  },
  'pullup_bar': {
    id: 'pullup_bar',
    name: 'Barra Fixa (ou Remo Invertido)',
    description: 'Se tiver barra: puxe o queixo acima da barra. Se não: faça remo invertido embaixo de uma mesa robusta.',
    reps: '3 x 8-10',
    difficulty: 'Avançado',
    target: 'Costas',
    videoId: 'eGo4IYlbE5g' // Pull Up
  },
  'superman': {
    id: 'superman',
    name: 'Superman',
    description: 'Deitado de bruços, levante braços e pernas simultaneamente contraindo a lombar. Segure 2s.',
    reps: '3 x 15',
    difficulty: 'Iniciante',
    target: 'Costas',
    videoId: 'z6PJMT2y8GQ' // Superman
  },
  'bicycle_crunch': {
    id: 'bicycle_crunch',
    name: 'Abdominal Bicicleta',
    description: 'Deitado, mãos na cabeça. Toque o cotovelo direito no joelho esquerdo e alterne rotacionando o tronco.',
    reps: '3 x 20',
    difficulty: 'Intermediário',
    target: 'Abdomen',
    videoId: 'Iwyvozckjak' // P4P Bicycle Crunch
  },
  'wall_sit': {
    id: 'wall_sit',
    name: 'Agachamento Isométrico (Parede)',
    description: 'Encoste na parede e sente no ar, joelhos a 90 graus. Mãos fora das pernas. Segure a dor.',
    reps: '3 x 45s',
    difficulty: 'Iniciante',
    target: 'Pernas',
    videoId: 'XULOKw4E4P4' // Wall Sit
  }
};

export const TRAINING_PLAN: TrainingPlan = {
  "Semana 1: O Despertar (Adaptação)": {
    "Segunda": ["pushup", "squat", "plank", "mountain_climber"],
    "Terça": ["lunge", "dips_chair", "superman", "leg_raise"],
    "Quarta": ["Cardio (Corrida 20min)"], // Special handler
    "Quinta": ["pushup", "squat", "plank", "mountain_climber"],
    "Sexta": ["lunge", "dips_chair", "bicycle_crunch", "burpee"],
    "Sábado": ["Cardio (Caminhada Acelerada 40min)"],
    "Domingo": ["Descanso"]
  },
  "Semana 2: Construindo a Armadura (Volume)": {
    "Segunda": ["pushup", "diamond_pushup", "squat", "plank"],
    "Terça": ["pullup_bar", "superman", "lunge", "leg_raise"],
    "Quarta": ["Cardio (HIIT 15min)"],
    "Quinta": ["pushup", "dips_chair", "jump_squat", "bicycle_crunch"],
    "Sexta": ["pullup_bar", "burpee", "wall_sit", "plank"],
    "Sábado": ["Cardio (Corrida 5km)"],
    "Domingo": ["Descanso"]
  },
  "Semana 3: Falha Total (Intensidade)": {
    "Segunda": ["explosive_pushup", "jump_squat", "leg_raise", "burpee"],
    "Terça": ["pullup_bar", "dips_chair", "lunge", "mountain_climber"],
    "Quarta": ["Cardio (HIIT 20min)"],
    "Quinta": ["diamond_pushup", "wall_sit", "bicycle_crunch", "superman"],
    "Sexta": ["burpee", "burpee", "plank", "squat"],
    "Sábado": ["Cardio (Corrida 30min Intensa)"],
    "Domingo": ["Descanso"]
  },
  "Semana 4: A Vingança (Metabólico)": {
    "Segunda": ["burpee", "mountain_climber", "jump_squat", "explosive_pushup"],
    "Terça": ["lunge", "step_up", "bicycle_crunch", "leg_raise"],
    "Quarta": ["Cardio (Corrida Tiros)"],
    "Quinta": ["pushup", "pullup_bar", "dips_chair", "plank"],
    "Sexta": ["burpee", "squat", "lunge", "mountain_climber"],
    "Sábado": ["Cardio (Longo 1h)"],
    "Domingo": ["Descanso"]
  }
};

export const MOTIVATIONAL_QUOTES = [
  "A dor é temporária. O arrependimento de desistir é eterno.",
  "Faça ela olhar para o que perdeu.",
  "Transforme sua raiva em combustível.",
  "O sucesso é a melhor vingança.",
  "Enquanto eles dormem, você treina."
];