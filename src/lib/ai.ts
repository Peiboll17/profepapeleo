import { useAjustes } from '../store/ajustes';

export interface AiOpciones {
  system: string;
  prompt: string;
  maxTokens?: number;
}

export class AiNoConfiguradaError extends Error {
  constructor() {
    super('La IA no está configurada. Añade tu API key en Ajustes.');
    this.name = 'AiNoConfiguradaError';
  }
}

/**
 * Llama a una API compatible con OpenAI (chat/completions) con la clave
 * propia del usuario (BYOK). La llamada sale directamente del navegador:
 * ProfePapeleo no ve ni almacena la clave fuera de este dispositivo.
 */
export async function aiTexto(op: AiOpciones): Promise<string> {
  const { aiEnabled, aiBaseUrl, aiApiKey, aiModel } = useAjustes.getState().ajustes;
  if (!aiEnabled || !aiApiKey) throw new AiNoConfiguradaError();

  const res = await fetch(`${aiBaseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${aiApiKey}`,
    },
    body: JSON.stringify({
      model: aiModel,
      messages: [
        { role: 'system', content: op.system },
        { role: 'user', content: op.prompt },
      ],
      max_tokens: op.maxTokens ?? 1200,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const detalle = await res.text().catch(() => '');
    throw new Error(`Error ${res.status} de la API de IA. ${detalle.slice(0, 300)}`);
  }
  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const texto = json.choices?.[0]?.message?.content?.trim();
  if (!texto) throw new Error('La IA devolvió una respuesta vacía. Prueba de nuevo.');
  return texto;
}

export const aiDisponible = (): boolean => {
  const a = useAjustes.getState().ajustes;
  return a.aiEnabled && Boolean(a.aiApiKey);
};

export const SYSTEM_REDACCION = [
  'Eres un asistente de redacción administrativa y pedagógica para docentes de España.',
  'Escribes en español de España, registro formal pero claro.',
  'Si te piden un documento administrativo, usas las fórmulas habituales',
  '(EXPONE, SOLICITA, ES TODO CUANTO SOLICITO...) sin inventar datos.',
  'Nunca inventas normas: si citas legislación, usa solo la que se te indique.',
].join(' ');
