import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { construirCentroDoc, defectosCentroDoc, type DatosCentroDoc } from '../../data/centro';
import { usePerfil } from '../../store/perfil';
import { useHistorial } from '../../store/historial';
import { Campo } from '../../components/Campo';
import { DocPreview } from '../../components/DocPreview';
import { Btn, Card, Nota, PageHeader, Stepper } from '../../components/ui';
import type { CampoDef } from '../../data/tramites';

const PASOS = ['Datos del centro', 'Introducción y objetivos'];

export default function EsqueletoWizard() {
  const [params] = useSearchParams();
  const { perfil } = usePerfil();
  const historial = useHistorial();
  const ctx = useMemo(() => ({ perfil }), [perfil]);

  const tipo: 'pga' | 'memoria' = params.get('tipo') === 'memoria' ? 'memoria' : 'pga';
  const esPga = tipo === 'pga';

  const [d, setD] = useState<DatosCentroDoc>(() => {
    const docId = params.get('doc');
    if (docId) {
      const doc = historial.obtener(docId);
      if (doc && (doc.tipo === 'pga' || doc.tipo === 'memoria'))
        return { ...defectosCentroDoc(perfil, tipo), ...(doc.datos as unknown as DatosCentroDoc) };
    }
    return defectosCentroDoc(perfil, tipo);
  });
  const [paso, setPaso] = useState(0);
  const [guardado, setGuardado] = useState(false);

  const set = (k: keyof DatosCentroDoc, v: string) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setGuardado(false);
  };

  const campos: CampoDef[][] = [
    [
      { tipo: 'text', id: 'denominacion', etiqueta: 'Denominación del centro' },
      { tipo: 'text', id: 'codigo', etiqueta: 'Código de centro' },
      { tipo: 'text', id: 'localidad', etiqueta: 'Localidad' },
      { tipo: 'text', id: 'enseñanzas', etiqueta: 'Enseñanzas impartidas' },
      { tipo: 'number', id: 'numeroAlumnos', etiqueta: 'Nº de alumnado (aprox.)' },
      { tipo: 'number', id: 'numeroDocentes', etiqueta: 'Nº de profesorado (aprox.)' },
      { tipo: 'text', id: 'director', etiqueta: 'Dirección' },
      { tipo: 'text', id: 'jefeEstudios', etiqueta: 'Jefatura de estudios' },
      { tipo: 'text', id: 'secretario', etiqueta: 'Secretaría' },
    ],
    [
      {
        tipo: 'textarea',
        id: 'introduccion',
        etiqueta: esPga ? 'Introducción de la PGA' : 'Introducción de la memoria',
        filas: 6,
      },
      {
        tipo: 'textarea',
        id: 'objetivos',
        etiqueta: esPga ? 'Objetivos prioritarios del curso — uno por línea' : 'Objetivos a valorar — uno por línea',
        filas: 6,
      },
    ],
  ];

  const doc = construirCentroDoc(d, perfil);
  const guardar = () => {
    historial.guardar({
      tipo,
      subtipo: esPga ? 'PGA' : 'memoria anual',
      titulo: doc.titulo,
      datos: { ...d } as unknown as Record<string, unknown>,
    });
    setGuardado(true);
  };

  return (
    <div>
      <PageHeader
        titulo={esPga ? 'Programación General Anual' : 'Memoria anual'}
        descripcion={
          esPga
            ? 'Esqueleto completo de la PGA con 15 apartados, datos del centro y guiones orientativos en cada sección.'
            : 'Esqueleto de la memoria de fin de curso espejo de la PGA: resultados, valoración de planes y propuestas de mejora.'
        }
        atras="/centro"
      />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(340px,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <Card className="p-5">
            <div className="mb-4">
              <Stepper pasos={PASOS} actual={paso} irA={setPaso} />
            </div>
            <h2 className="mb-3 font-semibold text-slate-800">{PASOS[paso]}</h2>
            {campos[paso].map((c) => (
              <Campo key={c.id} campo={c} valor={String(d[c.id as keyof DatosCentroDoc] ?? '')} onChange={(v) => set(c.id as keyof DatosCentroDoc, v as string)} />
            ))}
            <div className="flex items-center justify-between">
              <Btn variante="secundario" onClick={() => setPaso((p) => Math.max(0, p - 1))} deshabilitado={paso === 0}>
                ← Anterior
              </Btn>
              {paso === PASOS.length - 1 ? (
                <a href="#vista-previa">
                  <Btn>Ver documento ↓</Btn>
                </a>
              ) : (
                <Btn onClick={() => setPaso((p) => Math.min(PASOS.length - 1, p + 1))}>Siguiente →</Btn>
              )}
            </div>
          </Card>
          <div className="mt-4">
            <Nota tono="info">
              Cada comunidad aprueba instrucciones propias sobre el contenido y plazos de la {esPga ? 'PGA' : 'memoria'}:
              contrasta el índice con la circular de tu consejería antes de cerrarla.
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
