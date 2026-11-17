import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CCAA, CUERPOS } from '../data/ccaa';
import { perfilCompleto, usePerfil, type Perfil } from '../store/perfil';
import { Btn, Card, Nota, PageHeader } from '../components/ui';

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100';

function Fila({ children, etiqueta }: { children: React.ReactNode; etiqueta: string }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{etiqueta}</span>
      {children}
    </label>
  );
}

export default function PaginaPerfil() {
  const { perfil, guardar } = usePerfil();
  const navigate = useNavigate();
  const [p, setP] = useState<Perfil>({ ...perfil });
  const [guardadoMsg, setGuardadoMsg] = useState(false);

  const set = (k: keyof Perfil, v: string | boolean) => setP((prev) => ({ ...prev, [k]: v }));

  const guardarPerfil = () => {
    guardar(p);
    setGuardadoMsg(true);
    window.setTimeout(() => setGuardadoMsg(false), 2500);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        titulo="Tu perfil docente"
        descripcion="Se rellena una vez y autocompleta todos los documentos: escritos, programaciones y actas. Los datos se guardan solo en este navegador."
        atras="/"
      />

      {!perfilCompleto(p) && (
        <Nota tono="aviso">
          Completa al menos nombre, comunidad autónoma, centro y localidad para que los documentos salgan listos.
        </Nota>
      )}

      <Card className="mt-4 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Datos personales</h2>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Fila etiqueta="Nombre">
            <input className={inputBase} value={p.nombre} onChange={(e) => set('nombre', e.target.value)} />
          </Fila>
          <Fila etiqueta="Apellidos">
            <input className={inputBase} value={p.apellidos} onChange={(e) => set('apellidos', e.target.value)} />
          </Fila>
          <Fila etiqueta="DNI/NIF">
            <input className={inputBase} value={p.dni} onChange={(e) => set('dni', e.target.value)} />
          </Fila>
          <Fila etiqueta="Teléfono">
            <input className={inputBase} value={p.telefono} onChange={(e) => set('telefono', e.target.value)} />
          </Fila>
          <Fila etiqueta="Correo electrónico">
            <input className={inputBase} type="email" value={p.email} onChange={(e) => set('email', e.target.value)} />
          </Fila>
          <Fila etiqueta="Comunidad autónoma">
            <select className={inputBase} value={p.ccaa} onChange={(e) => set('ccaa', e.target.value)}>
              <option value="">— Elige —</option>
              {CCAA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </Fila>
        </div>

        <h2 className="mb-4 mt-6 text-lg font-semibold text-slate-800">Datos profesionales</h2>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Fila etiqueta="Cuerpo / situación">
            <select className={inputBase} value={p.cuerpo} onChange={(e) => set('cuerpo', e.target.value)}>
              <option value="">— Elige —</option>
              {CUERPOS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Fila>
          <Fila etiqueta="Especialidad">
            <input className={inputBase} placeholder="p. ej. Matemáticas" value={p.especialidad} onChange={(e) => set('especialidad', e.target.value)} />
          </Fila>
          <Fila etiqueta="Centro de destino">
            <input className={inputBase} value={p.centro} onChange={(e) => set('centro', e.target.value)} />
          </Fila>
          <Fila etiqueta="Código de centro">
            <input className={inputBase} value={p.codCentro} onChange={(e) => set('codCentro', e.target.value)} />
          </Fila>
          <Fila etiqueta="Localidad">
            <input className={inputBase} value={p.localidad} onChange={(e) => set('localidad', e.target.value)} />
          </Fila>
          <Fila etiqueta="Provincia">
            <input className={inputBase} value={p.provincia} onChange={(e) => set('provincia', e.target.value)} />
          </Fila>
          <Fila etiqueta="Fecha de primer nombramiento">
            <input className={inputBase} type="date" value={p.fechaNombramiento} onChange={(e) => set('fechaNombramiento', e.target.value)} />
          </Fila>
          <Fila etiqueta="Régimen">
            <select
              className={inputBase}
              value={p.regimen}
              onChange={(e) => set('regimen', e.target.value)}
            >
              <option value="publico">Público</option>
              <option value="concertado">Concertado</option>
              <option value="privado">Privado</option>
            </select>
          </Fila>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Btn onClick={guardarPerfil}>Guardar perfil</Btn>
          {guardadoMsg && <span className="text-sm text-emerald-700">✓ Guardado</span>}
          <span className="grow" />
          <Link to="/" className="text-sm text-teal-700 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </Card>
    </div>
  );
}
