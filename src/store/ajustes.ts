import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ajustes {
  /** IA opcional (BYOK): clave propia del usuario, compatible con API de OpenAI */
  aiEnabled: boolean;
  aiBaseUrl: string;
  aiApiKey: string;
  aiModel: string;
}

interface AjustesState {
  ajustes: Ajustes;
  guardar: (a: Partial<Ajustes>) => void;
}

export const useAjustes = create<AjustesState>()(
  persist(
    (set) => ({
      ajustes: {
        aiEnabled: false,
        aiBaseUrl: 'https://api.openai.com/v1',
        aiApiKey: '',
        aiModel: 'gpt-4o-mini',
      },
      guardar: (a) => set((s) => ({ ajustes: { ...s.ajustes, ...a } })),
    }),
    { name: 'pp-ajustes' },
  ),
);
