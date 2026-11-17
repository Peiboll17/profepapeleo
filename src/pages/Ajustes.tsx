import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAjustes } from '../store/ajustes';
import { useHistorial } from '../store/historial';
import { usePerfil } from '../store/perfil';
import { descargarBlob } from '../lib/download';
import { Btn, Card, Nota, PageHeader } from '../components/ui';

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100';

function Fila({ children, etiqueta, ayuda }: { children: React.ReactNode; etiqueta: string; ayuda?: string }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{etiqueta}</span>
      {children}
      {ayuda && <span className="mt-1 block text-xs text-slate-400">{ayuda}</span>}
    </label>
  );
}

export default function PaginaAjustes() {
  const { ajustes, guardar } = useAjustes();
  const historial = useHistorial();
  const { perfil } = usePerfil();
  const [a, setA] = useState({ ...ajustes });
  const [msg, setMsg] = useState('');

  const exportar = () => {
    const copia = { version: 1, exportado: new Date().toISOString(), perfil, ajustes: { ...a, aiApiKey: '' }, docs: historial.docs };
    descargarBlob(new Blob([JSON.stringify(copia, null, 2)], { type: 'application/json' }), `profepapeleo-copia-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const importar = async (f: File | undefined) => {
    if (!f) return;
    try {
      const json = JSON.parse(await f.text()) as { perfil?: typeof perfil; docs?: typeof historial.docs };
      if (json.perfil) usePerfil.getState().guardar(json.perfil);
      if (json.docs) for (const d of json.docs) historial.guardar(d);
      setMsg('✓ Copia importada correctamente');
    } catch {
      setMsg('✗ El archivo no es una copia válida');
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader titulo="Ajustes" descripcion="Configura la IA opcional y gestiona tus datos." atras="/" />

      <Card className="p-6">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">✨ IA generativa (opcional)</h2>
        <p className="mb-4 text-sm text-slate-500">
          Trae tu propia clave (BYOK) de cualquier proveedor compatible con la API de OpenAI. La clave se guarda
          únicamente en este navegador y las peticiones van directo de tu equipo al proveedor: ProfePapeleo no tiene
          servidores.
        </p>

        <label className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 accent-teal-700"
            checked={a.aiEnabled}
            onChange={(e) => setA({ ...a, aiEnabled: e.target.checked })}
          />
          Activar la IA en los asistentes
        </label>

        <div className="grid gap-x-4 sm:grid-cols-2">
          <Fila etiqueta="URL base de la API">
            <input className={inputBase} value={a.aiBaseUrl} onChange={(e) => setA({ ...a, aiBaseUrl: e.target.value })} />
          </Fila>
          <Fila etiqueta="Modelo">
            <input className={inputBase} value={a.aiModel} onChange={(e) => setA({ ...a, aiModel: e.target.value })} />
          </Fila>
          <div className="sm:col-span-2">
            <Fila etiqueta="Clave de API" ayuda="Guárdala con cuidado: permanece en este navegador y no se sincroniza con nadie.">
              <input className={inputBase} type="password" placeholder="sk-…" value={a.aiApiKey} onChange={(e) => setA({ ...a, aiApiKey: e.target.value })} />
            </Fila>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Btn
            onClick={() => {
              guardar(a);
              setMsg('✓ Ajustes guardados');
              window.setTimeout(() => setMsg(''), 2500);
            }}
          >
            Guardar ajustes
          </Btn>
          {msg && <span className="text-sm text-slate-600">{msg}</span>}
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">🔐 Tus datos</h2>
        <p className="mb-4 text-sm text-slate-500">
          Todo (perfil, historial y ajustes) vive en el almacenamiento local de este navegador. Exporta una copia
          periódicamente o para llevártela a otro equipo.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Btn variante="secundario" onClick={exportar}>
            ⬇️ Exportar copia (JSON)
          </Btn>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            ⬆️ Importar copia
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => importar(e.target.files?.[0])}
            />
          </label>
          <Btn
            variante="peligro"
            onClick={() => {
              if (confirm('¿Borrar TODOS los datos de ProfePapeleo en este navegador? Esta acción no se puede deshacer.')) {
                localStorage.removeItem('pp-perfil');
                localStorage.removeItem('pp-ajustes');
                localStorage.removeItem('pp-historial');
                location.href = '/';
              }
            }}
          >
            Borrar todo
          </Btn>
        </div>
      </Card>

      <div className="mt-6">
        <Nota tono="info">
          <b>Privacidad:</b> si activas la IA, los textos que envíes al proveedor saldrán de tu navegador bajo su
          política de privacidad. No envíes datos personales de alumnado: usa iniciales o descripciones anonimizadas.{' '}
          <Link to="/" className="underline">
            Volver
          </Link>
        </Nota>
      </div>
    </div>
  );
}
