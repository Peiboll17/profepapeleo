import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DOCS_FAMILIAS, construirLoteFamilias, docFamiliasPorId } from '../../data/familias';
import { usePerfil } from '../../store/perfil';
import { useHistorial } from '../../store/historial';
import { hoyISO } from '../../lib/format';
import { Campo } from '../../components/Campo';
import { DocPreview } from '../../components/DocPreview';
import { Card, Nota, PageHeader } from '../../components/ui';
import type { CampoDef } from '../../data/tramites';

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100';

const EJEMPLO_ALUMNOS = '[Nombre y apellidos del alumno/a 1]\n[Nombre y apellidos del alumno/a 2]';

export default function FamiliasWizard() {
  const [params] = useSearchParams();
  const { perfil } = usePerfil();
  const historial = useHistorial();

  const [docId, setDocId] = useState<string>(() => {
    const docIdParam = params.get('doc');
    if (docIdParam) {
      const d = historial.obtener(docIdParam);
      if (d && d.tipo === 'familias') return d.subtipo;
    }
    return 'comunicado';
  });
  const def = docFamiliasPorId(docId) ?? DOCS_FAMILIAS[0];

  const [datos, setDatos] = useState<Record<string, string>>(() => {
    const docIdParam = params.get('doc');
    if (docIdParam) {
      const d = historial.obtener(docIdParam);
      if (d && d.tipo === 'familias') return { ...(d.datos as unknown as Record<string, string>) };
    }
    return { fecha: hoyISO(), cursoGrupo: '' };
  });
  const [alumnos, setAlumnos] = useState('');
  const [guardado, setGuardado] = useState(false);

  const lista = alumnos.split('\n').map((l) => l.trim()).filter(Boolean);
  const listaPreview = lista.length > 0 ? lista : ['[Alumno/a 1]'];

  const setDato = (id: string, v: string) => {
    setDatos((d) => ({ ...d, [id]: v }));
    setGuardado(false);
  };

  const campos: CampoDef[] = useMemo(
    () => [
      { tipo: 'date', id: 'fecha', etiqueta: 'Fecha' },
      { tipo: 'text', id: 'cursoGrupo', etiqueta: 'Grupo / tutoría', placeholder: 'p. ej. 3º A' },
      ...def.campos.map<CampoDef>((c) => ({
        tipo: c.filas ? 'textarea' : 'text',
        id: c.id,
        etiqueta: c.etiqueta,
        placeholder: c.placeholder,
        requerido: c.requerido,
        filas: c.filas,
      })),
    ],
    [def],
  );

  const faltan = campos
    .filter((c) => c.requerido)
    .filter((c) => !String(datos[c.id] ?? '').trim());

  const doc = useMemo(
    () => construirLoteFamilias(def, listaPreview, datos, perfil),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [def, alumnos, datos, perfil],
  );

  const guardar = () => {
    // Privacidad: la lista de alumnos NUNCA se guarda
    historial.guardar({
      tipo: 'familias',
      subtipo: def.id,
      titulo: doc.titulo,
      datos: { ...datos, alumnos: '' } as unknown as Record<string, unknown>,
    });
    setGuardado(true);
  };

  return (
    <div>
      <PageHeader
        titulo="Documentos para familias"
        descripcion="Comunicados, autorizaciones, citaciones y avisos generados en lote desde una lista de alumnos. Sin guardar datos: los nombres solo se usan para componer el documento y se olvidan."
        atras="/"
      />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(340px,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <Card className="p-5">
            <h2 className="mb-3 font-semibold text-slate-800">1 · Elige el documento</h2>
            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              {DOCS_FAMILIAS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setDocId(d.id);
                    setGuardado(false);
                  }}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    d.id === docId ? 'border-teal-600 bg-teal-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{d.emoji}</span>
                  <span className="ml-1.5 font-medium text-slate-800">{d.nombre}</span>
                  <p className="mt-0.5 text-xs text-slate-500">{d.resumen}</p>
                </button>
              ))}
            </div>

            <h2 className="mb-3 font-semibold text-slate-800">2 · Datos del documento</h2>
            {campos.map((c) => (
              <Campo key={c.id} campo={c} valor={datos[c.id]} onChange={(v) => setDato(c.id, v as string)} />
            ))}

            <h2 className="mb-3 font-semibold text-slate-800">3 · Lista de alumnos/as</h2>
            <textarea
              className={`${inputBase} min-h-32 resize-y`}
              placeholder="Un alumno o alumna por línea…"
              value={alumnos}
              onChange={(e) => {
                setAlumnos(e.target.value);
                setGuardado(false);
              }}
            />
            <p className="mt-1 text-xs text-slate-400">
              {lista.length > 0
                ? `${lista.length} ${lista.length === 1 ? 'copia se' : 'copias se'} generarán (una por página).`
                : 'La vista previa muestra un ejemplo. Los nombres no se guardan ni se envían a ningún servidor.'}
            </p>

            {faltan.length > 0 && (
              <p className="mt-3 text-sm text-red-600">
                Completa los campos obligatorios: {faltan.map((f) => f.etiqueta).join(', ')}.
              </p>
            )}
          </Card>

          <div className="mt-4">
            <Nota tono="aviso">
              🔒 <b>Privacidad por diseño:</b> esta lista no se guarda en el historial (el documento se guarda sin
              nombres) y no sale de tu navegador. Genera, imprime y borra.
            </Nota>
          </div>
        </div>

        <div id="vista-previa" className="scroll-mt-4">
          <DocPreview titulo={doc.titulo} bloques={doc.bloques} alGuardar={guardar} guardado={guardado} />
        </div>
      </div>
    </div>
  );
}
