import type { Bloque } from '../lib/doc';
import type { Perfil } from '../store/perfil';
import { cursoActual, fechaLarga } from '../lib/format';

/* ─── Actas ───────────────────────────────────────────────────────── */

export const TIPOS_ACTA = [
  'Departamento didáctico',
  'Claustro de profesores',
  'Equipo técnico de coordinación pedagógica (ETCP/CCP)',
  'Equipo docente de grupo',
  'Consejo escolar',
  'Equipo de nivel o ciclo',
];

export interface DatosActa {
  tipo: string;
  numero: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  lugar: string;
  presidente: string;
  secretario: string;
  asistentes: string; // una línea por persona: «Nombre — cargo»
  ordenDia: string; // una línea por punto
  desarrollo: string; // párrafos; puede usar «Punto N:»
  acuerdos: string; // una línea por acuerdo
  proximaFecha: string;
  proximoLugar: string;
}

export const defectosActa = (): DatosActa => ({
  tipo: TIPOS_ACTA[0],
  numero: '',
  fecha: new Date().toISOString().slice(0, 10),
  horaInicio: '',
  horaFin: '',
  lugar: '',
  presidente: '',
  secretario: '',
  asistentes: '',
  ordenDia: 'Lectura y aprobación del acta anterior\n[Segundo punto del orden del día]\n[Tercer punto del orden del día]',
  desarrollo: 'Punto 1. [Desarrollo del primer punto del orden del día…]\n\nPunto 2. [Desarrollo…]',
  acuerdos: '',
  proximaFecha: '',
  proximoLugar: '',
});

const lineas = (t: string): string[] =>
  t.split('\n').map((l) => l.trim()).filter(Boolean);

export function construirActa(d: DatosActa, perfil: Perfil): { titulo: string; bloques: Bloque[] } {
  const titulo = `Acta ${d.numero ? `nº ${d.numero} ` : ''}de ${d.tipo}`;
  const asistentes = lineas(d.asistentes).map((l) => l.replace(/\s*[—–-]\s*/, ' — '));

  const bloques: Bloque[] = [
    { t: 'p', texto: perfil.centro || '[Centro]', clase: 'center' },
    { t: 'h1', texto: `ACTA${d.numero ? ` Nº ${d.numero}` : ''}` },
    { t: 'p', texto: `Reunión de ${d.tipo}`, clase: 'center' },
    {
      t: 'tabla',
      filas: [
        ['Fecha', fechaLarga(d.fecha)],
        ['Horario', `${d.horaInicio || '__'} — ${d.horaFin || '__'}`],
        ['Lugar', d.lugar || '__________'],
        ['Presidencia', d.presidente || '__________'],
        ['Secretaría', d.secretario || '__________'],
      ],
    },
    { t: 'h2', texto: 'Asistentes' },
  ];

  if (asistentes.length) bloques.push({ t: 'ul', items: asistentes });
  else bloques.push({ t: 'p', texto: '[Relación de personas asistentes.]' });

  bloques.push({ t: 'h2', texto: 'Orden del día' });
  bloques.push({ t: 'ol', items: lineas(d.ordenDia).length ? lineas(d.ordenDia) : ['[Puntos del orden del día]'] });

  bloques.push({ t: 'h2', texto: 'Desarrollo de la sesión' });
  for (const p of lineas(d.desarrollo)) bloques.push({ t: 'p', texto: p });

  if (d.acuerdos.trim()) {
    bloques.push({ t: 'h2', texto: 'Acuerdos adoptados' });
    bloques.push({ t: 'ol', items: lineas(d.acuerdos) });
  }

  if (d.proximaFecha || d.proximoLugar) {
    bloques.push({ t: 'h2', texto: 'Próxima convocatoria' });
    bloques.push({
      t: 'p',
      texto: `La próxima reunión se celebrará el ${fechaLarga(d.proximaFecha)}${d.proximoLugar ? `, en ${d.proximoLugar}` : ''}.`,
    });
  }

  bloques.push({ t: 'firma', nombre: d.secretario || 'El/La secretario/a', cargo: 'V.º B.º — El/La presidente/a' });
  return { titulo, bloques };
}

/* ─── Esqueletos: PGA y Memoria anual ─────────────────────────────── */

export interface DatosCentroDoc {
  tipoEsqueleto: 'pga' | 'memoria';
  // Datos del centro
  denominacion: string;
  codigo: string;
  localidad: string;
  enseñanzas: string;
  numeroAlumnos: string;
  numeroDocentes: string;
  director: string;
  jefeEstudios: string;
  secretario: string;
  // Contenido editable
  introduccion: string;
  objetivos: string;
}

export const defectosCentroDoc = (perfil: Perfil, tipo: 'pga' | 'memoria'): DatosCentroDoc => {
  const esPga = tipo === 'pga';
  return {
    tipoEsqueleto: tipo,
    denominacion: perfil.centro,
    codigo: perfil.codCentro,
    localidad: perfil.localidad,
    enseñanzas: '[Infantil, Primaria, ESO, Bachillerato, FP…]',
    numeroAlumnos: '',
    numeroDocentes: '',
    director: '',
    jefeEstudios: '',
    secretario: '',
    introduccion: esPga
      ? 'La Programación General Anual recoge el plan de funcionamiento del centro para el curso: objetivos, planes y programas, organización y calendario. Será aprobada por el Claustro y el Consejo Escolar antes del [fecha], conforme a la normativa autonómica aplicable, y de ella dará cuenta la Memoria de fin de curso.'
      : 'La presente memoria analiza el desarrollo del Plan de Centro y de la Programación General Anual durante el curso, valora los resultados académicos y de gestión, y recoge las propuestas de mejora para el próximo curso escolar.',
    objetivos: 'Objetivo 1. [Enunciado del objetivo prioritario]\nObjetivo 2. [Enunciado]\nObjetivo 3. [Enunciado]',
  };
};

export function construirCentroDoc(d: DatosCentroDoc, perfil: Perfil): { titulo: string; bloques: Bloque[] } {
  const esPga = d.tipoEsqueleto === 'pga';
  const titulo = esPga ? `Programación General Anual ${cursoActual()}` : `Memoria anual ${cursoActual()}`;

  const tablaCentro: Bloque = {
    t: 'tabla',
    filas: [
      ['Centro', d.denominacion || perfil.centro || '__________'],
      ['Código', d.codigo || '__________'],
      ['Localidad', d.localidad || perfil.localidad || '__________'],
      ['Enseñanzas impartidas', d.enseñanzas],
      ['Alumnado (aprox.)', d.numeroAlumnos || '____'],
      ['Profesorado (aprox.)', d.numeroDocentes || '____'],
      ['Dirección', d.director || '__________'],
      ['Jefatura de estudios', d.jefeEstudios || '__________'],
      ['Secretaría', d.secretario || '__________'],
    ],
  };

  const secciones: Bloque[] = esPga ? seccionesPga(d) : seccionesMemoria(d);

  return {
    titulo,
    bloques: [
      { t: 'h1', texto: titulo },
      { t: 'p', texto: `${d.denominacion || perfil.centro || '[Centro]'} — ${d.localidad || perfil.localidad || '[Localidad]'}`, clase: 'center' },
      { t: 'salto' },
      { t: 'h2', texto: '1. Datos del centro' },
      tablaCentro,
      { t: 'h2', texto: esPga ? '2. Introducción' : '2. Introducción y contexto del curso' },
      { t: 'p', texto: d.introduccion },
      ...secciones,
    ],
  };
}

function seccionesPga(d: DatosCentroDoc): Bloque[] {
  const apartado = (n: number, titulo: string, guion: string): Bloque[] => [
    { t: 'h2', texto: `${n}. ${titulo}` },
    { t: 'p', texto: guion },
  ];
  return [
    { t: 'h2', texto: '3. Objetivos prioritarios del curso' },
    { t: 'ol', items: lineas(d.objetivos) },
    ...apartado(4, 'Situación de partida', '[Análisis del contexto y resultados del curso anterior: datos socioeconómicos, resultados académicos, convivencia… Enlaza con la memoria del curso pasado.]'),
    ...apartado(5, 'Programaciones didácticas', '[Remisión a las programaciones de los distintos departamentos/áreas, aprobadas en el seno de los órganos de coordinación. Incluir novedades curriculares del curso.]'),
    ...apartado(6, 'Plan de atención a la diversidad', '[Medidas ordinarias y específicas, recursos de PT/AL, coordinación con el departamento de orientación, planes de refuerzo.]'),
    ...apartado(7, 'Plan de convivencia', '[Normas de centro y aula, protocolos de actuación, formación en convivencia, actividades de dinamización.]'),
    ...apartado(8, 'Plan de acción tutorial y orientación', '[Actuaciones por niveles, tutorías, entrevistas con familias, coordinación de equipos docentes, orientación académico-profesional.]'),
    ...apartado(9, 'Plan de formación del profesorado', '[Prioridades formativas, grupos de trabajo, proyectos de formación en centro.]'),
    ...apartado(10, 'Plan de lectura y biblioteca', '[Actividades de fomento de la lectura, coordinación con la biblioteca escolar, tiempos lectivos de lectura.]'),
    ...apartado(11, 'Plan digital del centro', '[Competencia digital del alumnado y del profesorado, recursos y entornos digitales, seguridad y ciudadanía digital.]'),
    ...apartado(12, 'Actividades complementarias y extraescolares', '[Programación de salidas, talleres, proyectos, servicios y actividades organizadas por nivel o etapa.]'),
    ...apartado(13, 'Organización y cargas horarias', '[Horarios del profesorado, guardias, cargos y sus dedicaciones, criterios de asignación de docencia,UD/complementarias.]'),
    ...apartado(14, 'Calendario del curso', '[Fechas de sesiones de evaluación, claustros, consejos escolares, reuniones de departamentos y jornadas no lectivas.]'),
    ...apartado(15, 'Anexos', '[Cualesquiera otros planes exigidos por la normativa autonómica (plan de igualdad, Plan de apertura, PLEX…).]'),
  ];
}

function seccionesMemoria(d: DatosCentroDoc): Bloque[] {
  const apartado = (n: number, titulo: string, guion: string): Bloque[] => [
    { t: 'h2', texto: `${n}. ${titulo}` },
    { t: 'p', texto: guion },
  ];
  return [
    ...apartado(3, 'Análisis de los resultados académicos', '[Resultados por etapas, áreas y grupos: porcentajes de promoción, titulación, materias con mayores índices de suspensos y comparativa con el curso anterior.]'),
    { t: 'h2', texto: '4. Valoración de los objetivos del curso' },
    { t: 'ol', items: lineas(d.objetivos).map((o) => `${o} — [grado de consecución y evidencias]`) },
    ...apartado(5, 'Valoración de planes y programas', '[Desarrollo del plan de convivencia, acción tutorial, lectura, formación, digital y atención a la diversidad: actuaciones realizadas y su valoración.]'),
    ...apartado(6, 'Actividades complementarias y extraescolares realizadas', '[Relación de actividades, participación y valoración.]'),
    ...apartado(7, 'Funcionamiento de los órganos de coordinación', '[Departamentos, ETCP, equipos docentes: reuniones celebradas e incidencias.]'),
    ...apartado(8, 'Propuestas de mejora', '[Conclusiones y propuestas concretas para incorporar a la PGA del próximo curso.]'),
    ...apartado(9, 'Anexos', '[Datos estadísticos, actas relevantes, informes de evaluación de diagnóstico u otras pruebas.]'),
  ];
}
