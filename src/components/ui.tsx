import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/* ─── Botón ───────────────────────────────────────────────────────── */

export function Btn({
  children,
  onClick,
  variante = 'primario',
  tipo = 'button',
  deshabilitado,
  className = '',
  pequeno,
}: {
  children: ReactNode;
  onClick?: () => void;
  variante?: 'primario' | 'secundario' | 'fantasma' | 'peligro';
  tipo?: 'button' | 'submit';
  deshabilitado?: boolean;
  className?: string;
  pequeno?: boolean;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const tam = pequeno ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5';
  const variantes = {
    primario: 'bg-teal-700 text-white hover:bg-teal-800',
    secundario: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    fantasma: 'text-teal-700 hover:bg-teal-50',
    peligro: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
  };
  return (
    <button type={tipo} onClick={onClick} disabled={deshabilitado} className={`${base} ${tam} ${variantes[variante]} ${className}`}>
      {children}
    </button>
  );
}

/* ─── Tarjeta ─────────────────────────────────────────────────────── */

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

/* ─── Cabecera de página ──────────────────────────────────────────── */

export function PageHeader({ titulo, descripcion, atras }: { titulo: string; descripcion?: string; atras?: string }) {
  return (
    <div className="mb-6">
      {atras && (
        <Link to={atras} className="mb-2 inline-flex items-center gap-1 text-sm text-teal-700 hover:underline">
          ← Volver
        </Link>
      )}
      <h1 className="text-2xl font-bold text-slate-900">{titulo}</h1>
      {descripcion && <p className="mt-1 max-w-2xl text-sm text-slate-500">{descripcion}</p>}
    </div>
  );
}

/* ─── Aviso / nota ────────────────────────────────────────────────── */

export function Nota({ children, tono = 'info' }: { children: ReactNode; tono?: 'info' | 'aviso' | 'exito' }) {
  const tonos = {
    info: 'bg-sky-50 border-sky-200 text-sky-900',
    aviso: 'bg-amber-50 border-amber-200 text-amber-900',
    exito: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  };
  return <div className={`rounded-lg border px-4 py-3 text-sm ${tonos[tono]}`}>{children}</div>;
}

/* ─── Stepper de pasos del asistente ──────────────────────────────── */

export function Stepper({ pasos, actual, irA }: { pasos: string[]; actual: number; irA: (i: number) => void }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm">
      {pasos.map((p, i) => {
        const hecho = i < actual;
        const activo = i === actual;
        return (
          <li key={p} className="flex items-center gap-1">
            {i > 0 && <span className={`mx-1 h-px w-4 ${hecho || activo ? 'bg-teal-600' : 'bg-slate-300'}`} />}
            <button
              type="button"
              onClick={() => irA(i)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors ${
                activo
                  ? 'bg-teal-700 text-white'
                  : hecho
                    ? 'text-teal-700 hover:bg-teal-50'
                    : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                  activo ? 'bg-white text-teal-700' : hecho ? 'bg-teal-100 text-teal-700' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {hecho ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{p}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ─── Etiqueta de estado ──────────────────────────────────────────── */

export function Badge({ children, tono = 'gris' }: { children: ReactNode; tono?: 'gris' | 'teal' | 'ambar' | 'rojo' }) {
  const tonos = {
    gris: 'bg-slate-100 text-slate-600',
    teal: 'bg-teal-100 text-teal-800',
    ambar: 'bg-amber-100 text-amber-800',
    rojo: 'bg-red-100 text-red-700',
  };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tonos[tono]}`}>{children}</span>;
}

/* ─── Estado vacío ────────────────────────────────────────────────── */

export function Vacio({ emoji, titulo, texto, accion }: { emoji: string; titulo: string; texto?: string; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <span className="text-4xl">{emoji}</span>
      <h3 className="mt-3 font-semibold text-slate-700">{titulo}</h3>
      {texto && <p className="mt-1 max-w-sm text-sm text-slate-500">{texto}</p>}
      {accion && <div className="mt-4">{accion}</div>}
    </div>
  );
}
