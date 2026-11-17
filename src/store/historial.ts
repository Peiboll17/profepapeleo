import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DocHistorial {
  id: string;
  /** Tipo de documento, p.ej. "tramite", "programacion", "acta", "pga" */
  tipo: string;
  /** Identificador de la variante, p.ej. "asuntos-propios" o el nombre del documento */
  subtipo: string;
  titulo: string;
  creado: number;
  actualizado: number;
  datos: Record<string, unknown>;
}

interface HistorialState {
  docs: DocHistorial[];
  guardar: (doc: Omit<DocHistorial, 'id' | 'creado' | 'actualizado'> & { id?: string }) => string;
  actualizar: (id: string, datos: Record<string, unknown>, titulo?: string) => void;
  eliminar: (id: string) => void;
  duplicar: (id: string) => string | undefined;
  obtener: (id: string) => DocHistorial | undefined;
}

export const useHistorial = create<HistorialState>()(
  persist(
    (set, get) => ({
      docs: [],
      guardar: (doc) => {
        const id = doc.id ?? nuevoId();
        const ahora = Date.now();
        const existente = get().docs.find((d) => d.id === id);
        const nuevo: DocHistorial = {
          ...doc,
          id,
          titulo: doc.titulo,
          creado: existente?.creado ?? ahora,
          actualizado: ahora,
        };
        set((s) => ({
          docs: [nuevo, ...s.docs.filter((d) => d.id !== id)].slice(0, 200),
        }));
        return id;
      },
      actualizar: (id, datos, titulo) =>
        set((s) => ({
          docs: s.docs.map((d) =>
            d.id === id
              ? { ...d, datos: { ...d.datos, ...datos }, titulo: titulo ?? d.titulo, actualizado: Date.now() }
              : d,
          ),
        })),
      eliminar: (id) => set((s) => ({ docs: s.docs.filter((d) => d.id !== id) })),
      duplicar: (id) => {
        const d = get().docs.find((x) => x.id === id);
        if (!d) return undefined;
        const nid = nuevoId();
        set((s) => ({
          docs: [{ ...d, id: nid, titulo: `${d.titulo} (copia)`, creado: Date.now(), actualizado: Date.now() }, ...s.docs],
        }));
        return nid;
      },
      obtener: (id) => get().docs.find((d) => d.id === id),
    }),
    { name: 'pp-historial' },
  ),
);

export function nuevoId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
