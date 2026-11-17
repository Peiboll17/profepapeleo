import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePerfil } from '../../store/perfil';
import { useHistorial } from '../../store/historial';
import { DocPreview } from '../../components/DocPreview';
import { Btn, Card, PageHeader } from '../../components/ui';
import type { Bloque } from '../../lib/doc';
import { aiDisponible, aiTexto, SYSTEM_REDACCION } from '../../lib/ai';

interface FilaRubrica {
  id: number;
  criterio: string;
  descriptores: string[];
}

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100';

export default function RubricaWizard() {
  const [params] = useSearchParams();
  const { perfil } = usePerfil();
  const historial = useHistorial();

  const [titulo, setTitulo] = useState('Rúbrica de evaluación');
  const [materia, setMateria] = useState(() => {
    const docId = params.get('doc');
    if (docId) {
      const d = historial.obtener(docId);
      if (d && d.tipo === 'rubrica') return String(d.datos.materia ?? '');
    }
    return '';
  });
  const [niveles, setNiveles] = useState<string[]>(['Insuficiente (1-4)', 'Suficiente (5-6)', 'Notable (7-8)', 'Excelente (9-10)']);
  const [filas, setFilas] = useState<FilaRubrica[]>([{ id: 1, criterio: '', descriptores: ['', '', '', ''] }]);
  const [cargandoIA, setCargandoIA] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [guardado, setGuardado] = useState(false);

  const datos = useMemo(() => ({ titulo, materia, niveles, filas }), [titulo, materia, niveles, filas]);

  const doc = useMemo<{ titulo: string; bloques: Bloque[] }>(() => {
    const subtitulo = `${materia ? `${materia} · ` : ''}${perfil.centro || ''}`.trim();
    const filasTabla: string[][] = [['Criterio', ...niveles]];
    for (const f of filas) filasTabla.push([f.criterio || '—', ...f.descriptores.map((x) => x || '—')]);
    return {
      titulo: `${titulo}${materia ? ` — ${materia}` : ''}`,
      bloques: [
        { t: 'h1', texto: titulo || 'Rúbrica de evaluación' },
        ...(subtitulo ? [{ t: 'p', texto: subtitulo, clase: 'muted' } as Bloque] : []),
        { t: 'tabla', encabezado: true, filas: filasTabla },
      ],
    };
  }, [titulo, materia, niveles, filas, perfil.centro]);

  const setNivel = (i: number, v: string) => {
    setNiveles((ns) => ns.map((n, j) => (j === i ? v : n)));
    setGuardado(false);
  };
  const setFila = (id: number, patch: Partial<FilaRubrica>) => {
    setFilas((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    setGuardado(false);
  };
  const addFila = () => setFilas((fs) => [...fs, { id: Date.now(), criterio: '', descriptores: niveles.map(() => '') }]);

  const generarIA = async (fila: FilaRubrica) => {
    if (!aiDisponible()) return;
    setCargandoIA(fila.id);
    setError('');
    try {
      const texto = await aiTexto({
        system: SYSTEM_REDACCION,
        prompt: `Escribe los descriptores de una rúbrica para el criterio de evaluación: "${fila.criterio}"${materia ? ` (materia: ${materia})` : ''}. Niveles: ${niveles.join(' | ')}. Devuelve EXACTAMENTE ${niveles.length} líneas, una por nivel en el mismo orden, cada una con una frase breve y observable. Sin numeración ni texto adicional.`,
        maxTokens: 500,
      });
      const lineas = texto.split('\n').map((l) => l.replace(/^[-•\d.\s]+/, '').trim()).filter(Boolean);
      setFila(fila.id, { descriptores: niveles.map((_, i) => lineas[i] ?? '') });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setCargandoIA(null);
    }
  };

  const guardar = () => {
    historial.guardar({ tipo: 'rubrica', subtipo: materia || 'rúbrica', titulo: doc.titulo, datos: JSON.parse(JSON.stringify(datos)) as unknown as Record<string, unknown> });
    setGuardado(true);
  };

  return (
    <div>
      <PageHeader titulo="Rúbrica de evaluación" descripcion="Tabla de criterios × niveles. Rellena los descriptores a mano o genera con IA." atras="/aula" />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(340px,0.85fr)_minmax(0,1.15fr)]">
        <Card className="p-5">
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Título</label>
              <input className={inputBase} value={titulo} onChange={(e) => { setTitulo(e.target.value); setGuardado(false); }} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Materia / contexto</label>
              <input className={inputBase} placeholder="p. ej. Matemáticas 1º ESO" value={materia} onChange={(e) => { setMateria(e.target.value); setGuardado(false); }} />
            </div>
          </div>

          <fieldset className="mb-4">
            <legend className="mb-1 block text-sm font-medium text-slate-700">Niveles de desempeño</legend>
            <div className="grid grid-cols-2 gap-2">
              {niveles.map((n, i) => (
                <input key={i} className={inputBase} value={n} onChange={(e) => setNivel(i, e.target.value)} />
              ))}
            </div>
          </fieldset>

          <h3 className="mb-2 text-sm font-semibold text-slate-700">Criterios</h3>
          {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
          {filas.map((f) => (
            <div key={f.id} className="mb-4 rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex gap-2">
                <input
                  className={inputBase}
                  placeholder="Criterio de evaluación…"
                  value={f.criterio}
                  onChange={(e) => setFila(f.id, { criterio: e.target.value })}
                />
                <Btn pequeno variante="peligro" onClick={() => setFilas((fs) => fs.filter((x) => x.id !== f.id))}>
                  ✕
                </Btn>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {f.descriptores.map((desc, i) => (
                  <textarea
                    key={i}
                    className={`${inputBase} min-h-16 text-xs`}
                    placeholder={`${niveles[i] ?? `Nivel ${i + 1}`}: descriptor…`}
                    value={desc}
                    onChange={(e) =>
                      setFila(f.id, { descriptores: f.descriptores.map((x, j) => (j === i ? e.target.value : x)) })
                    }
                  />
                ))}
              </div>
              {aiDisponible() && (
                <button
                  className="mt-2 text-xs text-teal-700 underline disabled:text-slate-400"
                  disabled={!f.criterio.trim() || cargandoIA === f.id}
                  onClick={() => generarIA(f)}
                >
                  {cargandoIA === f.id ? '✨ Generando…' : '✨ Generar descriptores con IA'}
                </button>
              )}
            </div>
          ))}
          <Btn variante="secundario" onClick={addFila}>
            + Añadir criterio
          </Btn>
        </Card>

        <div id="vista-previa" className="scroll-mt-4">
          <DocPreview titulo={doc.titulo} bloques={doc.bloques} alGuardar={guardar} guardado={guardado} />
        </div>
      </div>
    </div>
  );
}
