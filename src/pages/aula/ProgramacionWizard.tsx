import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ETAPAS,
  construirProgramacion,
  defectosProgramacion,
  semillaPorId,
  semillasPorEtapa,
  textoIntroduccion,
  type DatosProgramacion,
} from '../../data/programacion';
import { ccaaPorId, marcoNormativoCcaa } from '../../data/ccaa';
import { curriculoLiteralPorSemilla } from '../../data/curriculo';
import { usePerfil } from '../../store/perfil';
import { useHistorial } from '../../store/historial';
import { useAjustes } from '../../store/ajustes';
import { Campo } from '../../components/Campo';
import { DocPreview } from '../../components/DocPreview';
import { Btn, Card, Nota, PageHeader, Stepper } from '../../components/ui';
import type { CampoDef } from '../../data/tramites';
import { aiDisponible, aiTexto, SYSTEM_REDACCION } from '../../lib/ai';

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100';

/** Botón de generación con IA (BYOK). Degrada elegantemente sin clave. */
function BotonIA({
  alPulsar,
  alAplicar,
  etiqueta,
}: {
  alPulsar: () => Promise<string>;
  alAplicar: (texto: string) => void;
  etiqueta: string;
}) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const disponible = aiDisponible();

  if (!disponible)
    return (
      <Link to="/ajustes" className="text-xs text-slate-400 underline hover:text-teal-700">
        ✨ IA disponible (configura tu clave)
      </Link>
    );

  return (
    <>
      <Btn
        pequeno
        variante="secundario"
        deshabilitado={cargando}
        onClick={async () => {
          setCargando(true);
          setError('');
          try {
            const texto = await alPulsar();
            if (texto) alAplicar(texto);
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Error inesperado');
          } finally {
            setCargando(false);
          }
        }}
      >
        {cargando ? '✨ Generando…' : `✨ ${etiqueta}`}
      </Btn>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </>
  );
}

export default function ProgramacionWizard() {
  const [params] = useSearchParams();
  const { perfil } = usePerfil();
  const historial = useHistorial();
  const { ajustes } = useAjustes();
  const ctx = useMemo(() => ({ perfil }), [perfil]);

  const [d, setD] = useState<DatosProgramacion>(() => {
    const docId = params.get('doc');
    if (docId) {
      const doc = historial.obtener(docId);
      if (doc && doc.tipo === 'programacion')
        return { ...defectosProgramacion({ perfil }), ...(doc.datos as unknown as DatosProgramacion) };
    }
    return defectosProgramacion({ perfil });
  });
  const [paso, setPaso] = useState(0);
  const [guardado, setGuardado] = useState(false);
  const [tocado, setTocado] = useState<Set<string>>(new Set());

  const set = (k: keyof DatosProgramacion, v: string | number) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setTocado((t) => new Set(t).add(k));
    setGuardado(false);
  };

  const cambiarEtapa = (etapa: string) => {
    const primera = semillasPorEtapa(etapa)[0];
    const lit = primera ? curriculoLiteralPorSemilla(primera.id) : undefined;
    setD((prev) => {
      const nuevaMateria = tocado.has('materia')
        ? prev.materia
        : (primera?.nombre ?? (etapa === 'fp' ? '[Módulo profesional]' : prev.materia));
      const nuevoCurso = tocado.has('curso')
        ? prev.curso
        : (primera?.cursos[0] ?? (etapa === 'fp' ? '1º [ciclo formativo]' : prev.curso));
      return {
        ...prev,
        etapa,
        semillaId: primera?.id ?? 'otra',
        materia: nuevaMateria,
        curso: nuevoCurso,
        horasSemanales: tocado.has('horasSemanales')
          ? prev.horasSemanales
          : etapa === 'infantil'
            ? '25'
            : etapa === 'fp'
              ? ''
              : '4',
        introduccion: tocado.has('introduccion') ? prev.introduccion : textoIntroduccion(nuevaMateria, nuevoCurso),
        fuenteCE: tocado.has('competenciasTexto') ? prev.fuenteCE : (lit?.fuente ?? ''),
        competenciasTexto: tocado.has('competenciasTexto')
          ? prev.competenciasTexto
          : (lit?.competencias.join('\n') ??
            (primera?.competencias.join('\n') ??
              '[Escribe aquí las competencias específicas de la materia —en FP, los resultados de aprendizaje del módulo—, una por línea]')),
        saberesTexto: tocado.has('saberesTexto')
          ? prev.saberesTexto
          : (primera?.saberes.map((b) => `${b.bloque}: ${b.resumen}`).join('\n') ??
            '[Escribe aquí los saberes básicos o los contenidos del módulo, una línea por bloque]'),
        marcoNormativo: tocado.has('marcoNormativo')
          ? prev.marcoNormativo
          : marcoNormativoCcaa(ccaa, etapa)
              .map((l) => `− ${l}`)
              .join('\n'),
      };
    });
    setGuardado(false);
  };

  const cambiarSemilla = (idSemilla: string) => {
    const s = semillaPorId(idSemilla);
    if (!s) return;
    const lit = curriculoLiteralPorSemilla(s.id);
    setD((prev) => ({
      ...prev,
      semillaId: idSemilla,
      materia: s.nombre,
      curso: tocado.has('curso') ? prev.curso : (s.cursos[0] ?? prev.curso),
      fuenteCE: tocado.has('competenciasTexto') ? prev.fuenteCE : (lit?.fuente ?? ''),
      competenciasTexto: tocado.has('competenciasTexto')
        ? prev.competenciasTexto
        : (lit?.competencias.join('\n') ?? s.competencias.join('\n')),
      saberesTexto: tocado.has('saberesTexto') ? prev.saberesTexto : s.saberes.map((b) => `${b.bloque}: ${b.resumen}`).join('\n'),
    }));
    setGuardado(false);
  };

  const semillas = semillasPorEtapa(d.etapa);
  const ccaa = ccaaPorId(perfil.ccaa);
  const resumenCurriculo = [
    ccaa?.normativa?.curriculo?.primaria,
    ccaa?.normativa?.curriculo?.eso,
    ccaa?.normativa?.curriculo?.bachillerato,
    ccaa?.normativa?.curriculo?.basica,
  ]
    .filter(Boolean)
    .join(' · ');
  const doc = construirProgramacion(d, ctx);

  const pasos = [
    'Materia y curso',
    'Marco normativo',
    'Introducción',
    'Competencias y saberes',
    'Metodología',
    'Diversidad',
    'Evaluación',
    'Unidades',
    'Transversales',
  ];

  const campo = (
    id: keyof DatosProgramacion,
    etiqueta: string,
    extras?: Partial<CampoDef>,
  ): CampoDef => ({ tipo: 'textarea', id, etiqueta, filas: 8, ...extras });

  const pasoCampos: CampoDef[][] = [
    [
      { tipo: 'select', id: 'etapa', etiqueta: 'Etapa', opciones: ETAPAS.map((e) => ({ valor: e.id, etiqueta: e.nombre })) },
      {
        tipo: 'select',
        id: 'semillaId',
        etiqueta: d.etapa === 'fp' ? 'Módulo / materia (plantillas precargadas)' : 'Materia (plantillas precargadas)',
        ayuda:
          d.etapa === 'fp'
            ? 'En FP escribe el módulo profesional y su ciclo: p. ej. «Lenguajes de Marcas y Sistemas de Gestión de Información (1º DAW)».'
            : d.etapa === 'infantil'
              ? 'Las tres áreas del currículo de infantil (RD 95/2022) están precargadas como resumen orientativo.'
              : 'Si tu materia no está, elige «Otra» y rellena los apartados a mano o con IA.',
        opciones: [...semillas.map((s) => ({ valor: s.id, etiqueta: s.nombre })), { valor: 'otra', etiqueta: 'Otra / escribir a mano' }],
      },
      { tipo: 'text', id: 'materia', etiqueta: d.etapa === 'fp' ? 'Nombre del módulo profesional (editable)' : 'Nombre de la materia (editable)', requerido: true },
      {
        tipo: 'text',
        id: 'curso',
        etiqueta: 'Curso y grupo',
        requerido: true,
        placeholder: d.etapa === 'infantil' ? '3 años' : d.etapa === 'fp' ? '1º DAW' : '1º ESO',
      },
      {
        tipo: 'number',
        id: 'horasSemanales',
        etiqueta: d.etapa === 'infantil' ? 'Horas semanales del grupo' : d.etapa === 'fp' ? 'Horas semanales del módulo' : 'Horas semanales',
        ayuda:
          d.etapa === 'infantil'
            ? 'En infantil el tutor/a imparte toda la jornada (25 h semanales habituales).'
            : d.etapa === 'fp'
              ? 'Cada módulo profesional tiene su carga horaria según el RD del título.'
              : undefined,
      },
    ],
    [campo('marcoNormativo', 'Marco normativo', { filas: 5 })],
    [campo('introduccion', 'Introducción y justificación')],
    [
      campo('competenciasTexto', 'Competencias específicas (una por línea)'),
      campo('saberesTexto', 'Saberes básicos por bloques (una línea por bloque)'),
    ],
    [campo('metodologia', 'Metodología y situaciones de aprendizaje')],
    [campo('atencionDiversidad', 'Atención a la diversidad y a las diferencias individuales')],
    [campo('evaluacion', 'Evaluación (instrumentos, recuperación)'), campo('calificacion', 'Criterios de calificación')],
    [campo('unidadesTexto', 'Unidades didácticas — una por línea: «Título | sesiones»', { filas: 10 })],
    [campo('transversales', 'Elementos transversales'), campo('extraescolares', 'Actividades complementarias y extraescolares')],
  ];

  const generoIA = async (que: 'introduccion' | 'unidades' | 'competencias'): Promise<string> => {
    const ctxTxt = `materia: ${d.materia}; curso: ${d.curso}; etapa: ${ETAPAS.find((e) => e.id === d.etapa)?.nombre}; centro en ${perfil.localidad || '[localidad]'}`;
    if (que === 'introduccion') {
      return aiTexto({
        system: SYSTEM_REDACCION,
        prompt: `Redacta la introducción/justificación de una programación didáctica (${ctxTxt}) según la LOMLOE: enfoque competencial, situaciones de aprendizaje, contribución al perfil de salida. Máximo 3 párrafos, sin títulos, sin numeración.`,
      });
    }
    if (que === 'unidades') {
      return aiTexto({
        system: SYSTEM_REDACCION,
        prompt: `Propón ${d.numeroUnidades} unidades didácticas para el curso completo (${ctxTxt}), siguiendo el currículo LOMLOE con progresión lógica. Devuelve EXACTAMENTE una línea por unidad con el formato: «Unidad N. Título | X sesiones». Sin texto adicional.`,
      });
    }
    return aiTexto({
      system: SYSTEM_REDACCION,
      prompt: `Desarrolla cada una de las siguientes competencias específicas de ${d.materia} (${d.curso}) con una descripción de 2 frases y añade debajo, como sublista, 2-3 criterios de evaluación asociados. Listado de partida:\n${d.competenciasTexto}`,
    });
  };

  const guardar = () => {
    historial.guardar({ tipo: 'programacion', subtipo: d.materia, titulo: doc.titulo, datos: { ...d } as unknown as Record<string, unknown> });
    setGuardado(true);
  };

  return (
    <div>
      <PageHeader
        titulo="Programación didáctica"
        descripcion="Documento LOMLOE completo con 13 secciones, precargado con textos paramétricos que puedes editar."
        atras="/aula"
      />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(340px,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <Card className="p-5">
            <div className="mb-4">
              <Stepper pasos={pasos} actual={paso} irA={setPaso} />
            </div>

            <h2 className="mb-3 font-semibold text-slate-800">{pasos[paso]}</h2>

            {pasoCampos[paso].map((c) => {
              if (c.id === 'etapa' || c.id === 'semillaId') {
                return (
                  <div key={c.id} className="mb-4">
                    <label htmlFor={`campo-${c.id}`} className="mb-1 block text-sm font-medium text-slate-700">
                      {c.etiqueta}
                    </label>
                    <select
                      id={`campo-${c.id}`}
                      className={inputBase}
                      value={String(c.id === 'etapa' ? d.etapa : d.semillaId)}
                      onChange={(e) =>
                        c.id === 'etapa'
                          ? cambiarEtapa(e.target.value)
                          : e.target.value === 'otra'
                            ? set('semillaId', 'otra')
                            : cambiarSemilla(e.target.value)
                      }
                    >
                      {c.opciones?.map((o) => (
                        <option key={o.valor} value={o.valor}>
                          {o.etiqueta}
                        </option>
                      ))}
                    </select>
                    {c.ayuda && <p className="mt-1 text-xs text-slate-400">{c.ayuda}</p>}
                  </div>
                );
              }
              const clave = c.id as keyof DatosProgramacion;
              return (
                <div key={c.id}>
                  <Campo campo={c} valor={String(d[clave] ?? '')} onChange={(v) => set(clave, v as string)} />
                  {c.id === 'competenciasTexto' && d.fuenteCE && (
                    <div className="-mt-2 mb-4">
                      <Nota tono="exito">
                        ✅ <b>Texto literal del currículo estatal</b> ({d.fuenteCE}) — la fuente aparece citada en el
                        documento. Verifica el decreto de tu comunidad autónoma, que puede introducir adaptaciones.
                      </Nota>
                    </div>
                  )}
                  {c.id === 'marcoNormativo' && ccaa && (
                    <div className="-mt-2 mb-4">
                      <Nota tono="info">
                        <b>Currículo de {ccaa.nombre}</b> —{' '}
                        {resumenCurriculo || 'sin decreto precargado, complétalo desde su web'} ·{' '}
                        <a className="underline" href={ccaa.sede} target="_blank" rel="noreferrer">
                          sede electrónica
                        </a>
                      </Nota>
                    </div>
                  )}
                  {c.id === 'introduccion' && (
                    <div className="-mt-2 mb-4">
                      <BotonIA
                        etiqueta="Redactar introducción"
                        alPulsar={() => generoIA('introduccion')}
                        alAplicar={(t) => set('introduccion', t)}
                      />
                    </div>
                  )}
                  {c.id === 'competenciasTexto' && (
                    <div className="-mt-2 mb-4">
                      <BotonIA
                        etiqueta="Desarrollar con IA"
                        alPulsar={() => generoIA('competencias')}
                        alAplicar={(t) => set('competenciasTexto', t)}
                      />
                    </div>
                  )}
                  {c.id === 'unidadesTexto' && (
                    <div className="-mt-2 mb-4">
                      <BotonIA
                        etiqueta="Proponer unidades"
                        alPulsar={() => generoIA('unidades')}
                        alAplicar={(t) => set('unidadesTexto', t)}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <div className="mt-2 flex items-center justify-between">
              <Btn variante="secundario" onClick={() => setPaso((p) => Math.max(0, p - 1))} deshabilitado={paso === 0}>
                ← Anterior
              </Btn>
              {paso === pasoCampos.length - 1 ? (
                <a href="#vista-previa">
                  <Btn>Ver documento ↓</Btn>
                </a>
              ) : (
                <Btn onClick={() => setPaso((p) => Math.min(pasoCampos.length - 1, p + 1))}>Siguiente →</Btn>
              )}
            </div>
          </Card>

          {ajustes.aiEnabled && (
            <Nota tono="info">
              IA activa: revisa siempre el resultado antes de entregar. El texto generado puede contener imprecisiones sobre tu currículo autonómico.
            </Nota>
          )}
        </div>

        <div id="vista-previa" className="scroll-mt-4">
          <DocPreview titulo={doc.titulo} bloques={doc.bloques} alGuardar={guardar} guardado={guardado} />
        </div>
      </div>
    </div>
  );
}
