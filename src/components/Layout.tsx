import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const ENLACES = [
  { to: '/', etiqueta: 'Inicio', icono: '🏠' },
  { to: '/tramites', etiqueta: 'Trámites', icono: '🏛️' },
  { to: '/aula', etiqueta: 'Aula', icono: '📚' },
  { to: '/centro', etiqueta: 'Centro', icono: '🏫' },
  { to: '/historial', etiqueta: 'Historial', icono: '🗂️' },
];

function claseActiva({ isActive }: { isActive: boolean }): string {
  return isActive ? 'font-semibold text-teal-800' : 'text-slate-600 hover:text-teal-800';
}

export default function Layout() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Cabecera */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            <span className="text-lg font-bold text-teal-800">ProfePapeleo</span>
          </NavLink>
          <nav className="ml-6 hidden gap-5 text-sm md:flex">
            {ENLACES.slice(1).map((e) => (
              <NavLink key={e.to} to={e.to} className={claseActiva}>
                {e.etiqueta}
              </NavLink>
            ))}
          </nav>
          <span className="grow" />
          <NavLink to="/ajustes" className="text-sm text-slate-500 hover:text-teal-800" title="Ajustes">
            ⚙️ <span className="hidden sm:inline">Ajustes</span>
          </NavLink>
          <NavLink
            to="/perfil"
            className="rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800"
          >
            Mi perfil
          </NavLink>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-400">
        ProfePapeleo · Documentos orientativos: verifica siempre la normativa y plantillas oficiales de tu comunidad
        autónoma. Tus datos no salen de este navegador (salvo que actives la IA).
      </footer>

      {/* Navegación inferior en móvil */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white/95 py-1.5 backdrop-blur md:hidden">
        {ENLACES.map((e) => (
          <NavLink
            key={e.to}
            to={e.to}
            end={e.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-1 text-[11px] ${isActive ? 'text-teal-800 font-semibold' : 'text-slate-500'}`
            }
          >
            <span className="text-lg leading-none">{e.icono}</span>
            {e.etiqueta}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
