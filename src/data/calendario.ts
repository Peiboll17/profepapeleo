/**
 * Hitos típicos del curso escolar en España (curso 2026/2027).
 * Las fechas son orientativas y editables por el docente en la página de
 * calendario: cada centro y comunidad fija las suyas en su calendario escolar.
 */

export interface HitoCalendario {
  nombre: string;
  descripcion: string;
  /** Fecha orientativa por defecto (editable en la página) */
  fecha: string;
}

export interface MesCalendario {
  mes: string;
  hitos: HitoCalendario[];
}

export const HITOS_CURSO: MesCalendario[] = [
  {
    mes: 'Septiembre',
    hitos: [
      { nombre: 'Evaluación inicial', descripcion: 'Diagnóstico del punto de partida del grupo. Reunión de equipo docente y primeras medidas de refuerzo.', fecha: '2026-09-24' },
      { nombre: 'Reuniones generales con familias', descripcion: 'Presentación de tutoría, equipos docentes y planificación del curso.', fecha: '2026-09-29' },
    ],
  },
  {
    mes: 'Octubre',
    hitos: [
      { nombre: 'Cierre de la evaluación inicial', descripcion: 'Conclusión de las medidas adoptadas tras la evaluación inicial (actas de sesión, en su caso).', fecha: '2026-10-15' },
      { nombre: 'Comunicación de planes de refuerzo', descripcion: 'Información a las familias del alumnado con materias pendientes o refuerzos.', fecha: '2026-10-22' },
    ],
  },
  {
    mes: 'Noviembre / Diciembre',
    hitos: [
      { nombre: 'Sesiones de evaluación de la 1ª evaluación', descripcion: 'Junta de evaluación del equipo docente por grupo.', fecha: '2026-11-26' },
      { nombre: 'Entrega de boletines de notas a familias', descripcion: 'Boletín individualizado de la 1ª evaluación.', fecha: '2026-12-04' },
      { nombre: 'Actas de la 1ª evaluación', descripcion: 'Registro en Séneca/SIGAD u otro sistema de la comunidad (según CCAA).', fecha: '2026-12-11' },
    ],
  },
  {
    mes: 'Enero / Febrero',
    hitos: [
      { nombre: 'Reuniones de tutoría con familias', descripcion: 'Entrevistas individuales tras la 1ª evaluación.', fecha: '2027-01-14' },
      { nombre: 'Sesiones de evaluación de la 2ª evaluación', descripcion: 'Junta de evaluación del equipo docente por grupo.', fecha: '2027-03-04' },
      { nombre: 'Entrega de boletines de la 2ª evaluación', descripcion: 'Boletín individualizado.', fecha: '2027-03-11' },
    ],
  },
  {
    mes: 'Marzo / Abril',
    hitos: [
      { nombre: 'Sesión de evaluación intermedia de la 3ª evaluación', descripcion: 'Seguimiento del alumnado en riesgo y planes de recuperación.', fecha: '2027-04-29' },
      { nombre: 'Elección de materias de 4º / Bachillerato', descripcion: 'Proceso de elección de materias y opciones para el próximo curso.', fecha: '2027-05-06' },
    ],
  },
  {
    mes: 'Mayo / Junio',
    hitos: [
      { nombre: 'Sesiones de evaluación ordinaria (final)', descripcion: 'Junta de evaluación final por grupo.', fecha: '2027-06-09' },
      { nombre: 'Actas finales y titulación', descripcion: 'Actas de evaluación final, titulación de ESO/Bachillerato y consejo orientador (2º ESO y 4º).', fecha: '2027-06-16' },
      { nombre: 'Evaluación extraordinaria', descripcion: 'Sesión extraordinaria para el alumnado con materias no superadas.', fecha: '2027-06-23' },
      { nombre: 'Memoria fin de curso', descripcion: 'Memoria anual y cierre de la PGA. Último día lectivo.', fecha: '2027-06-24' },
    ],
  },
];

export interface AvisoFechas {
  nombre: string;
  texto: string;
}

/** Recordatorios sin fecha fija: dependen de la convocatoria de cada comunidad */
export const AVISOS_FLEXIBLES: AvisoFechas[] = [
  {
    nombre: 'Sexenios / tramos de docencia',
    texto: 'La convocatoria de reconocimiento de sexenios se publica cada año con plazos propios en tu comunidad autónoma. Consulta la orden de convocatoria en la sede electrónica: no se reconocen a petición tardía.',
  },
  {
    nombre: 'Programas y ayudas (editoriales, proyectos, formación)',
    texto: 'Las convocatorias de proyectos y formación (centros de profesorado, INTEF, planes del centro) se publican entre septiembre y octubre: revisa el boletín de tu consejería.',
  },
  {
    nombre: 'Renovación de permisos y licencias',
    texto: 'Los permisos por asuntos propios y licencias por formación suelen solicitararse con antelación de 10-30 días hábiles según la comunidad: planifica el curso en septiembre.',
  },
];
