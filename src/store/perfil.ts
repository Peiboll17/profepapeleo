import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Perfil {
  nombre: string;
  apellidos: string;
  dni: string;
  /** id de comunidad autónoma (data/ccaa) */
  ccaa: string;
  cuerpo: string;
  especialidad: string;
  centro: string;
  codCentro: string;
  localidad: string;
  provincia: string;
  email: string;
  telefono: string;
  /** Fecha del primer nombramiento como funcionario (YYYY-MM-DD) */
  fechaNombramiento: string;
  regimen: 'publico' | 'concertado' | 'privado';
  funcionario: boolean;
}

const perfilVacio: Perfil = {
  nombre: '',
  apellidos: '',
  dni: '',
  ccaa: '',
  cuerpo: '',
  especialidad: '',
  centro: '',
  codCentro: '',
  localidad: '',
  provincia: '',
  email: '',
  telefono: '',
  fechaNombramiento: '',
  regimen: 'publico',
  funcionario: true,
};

interface PerfilState {
  perfil: Perfil;
  guardar: (p: Partial<Perfil>) => void;
  borrar: () => void;
}

export const usePerfil = create<PerfilState>()(
  persist(
    (set) => ({
      perfil: perfilVacio,
      guardar: (p) => set((s) => ({ perfil: { ...s.perfil, ...p } })),
      borrar: () => set({ perfil: perfilVacio }),
    }),
    { name: 'pp-perfil' },
  ),
);

export const perfilCompleto = (p: Perfil): boolean =>
  Boolean(p.nombre && p.apellidos && p.ccaa && p.centro && p.localidad);

export const nombreCompleto = (p: Perfil): string =>
  [p.nombre, p.apellidos].filter(Boolean).join(' ').trim();
