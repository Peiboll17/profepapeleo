import type { Bloque } from '../lib/doc';
import type { Perfil } from '../store/perfil';
import { fechaLarga } from '../lib/format';

/**
 * Documentos para familias generados EN LOTE desde una lista de alumnos.
 * Privacidad por diseño: la lista vive solo en el estado del asistente y
 * no se guarda en el historial ni sale del navegador.
 */

export interface CampoFamilias {
  id: string;
  etiqueta: string;
  placeholder?: string;
  requerido?: boolean;
  filas?: number;
}

export interface DocFamiliasDef {
  id: string;
  nombre: string;
  emoji: string;
  resumen: string;
  /** Campos específicos del documento (comunes: tutoría, fecha) */
  campos: CampoFamilias[];
  /** Cuerpo para UN alumno (sin cabecera del centro ni firma, que son comunes) */
  cuerpo(alumno: string, datos: Record<string, string>, perfil: Perfil): Bloque[];
}

const cabecera = (perfil: Perfil, fecha: string): Bloque[] => [
  { t: 'p', texto: perfil.centro || '[Centro]', clase: 'center' },
  { t: 'p', texto: perfil.localidad ? `${perfil.localidad}, ${fechaLarga(fecha)}` : fechaLarga(fecha), clase: 'right' },
];

const despedida = (perfil: Perfil): Bloque[] => [
  { t: 'p', texto: 'Atentamente,' },
  {
    t: 'firma',
    nombre: [perfil.nombre, perfil.apellidos].filter(Boolean).join(' ') || '[Tutor/a]',
    cargo: 'Tutor/a',
  },
];

const parrafos = (...textos: (string | undefined)[]): Bloque[] =>
  textos
    .filter((t) => String(t ?? '').trim())
    .flatMap<Bloque>((texto) =>
      String(texto)
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => ({ t: 'p', texto: p })),
    );

export const DOCS_FAMILIAS: DocFamiliasDef[] = [
  {
    id: 'comunicado',
    nombre: 'Comunicado a la familia',
    emoji: '📨',
    resumen: 'Comunicación ordinaria sobre cualquier aspecto del alumnado.',
    campos: [
      { id: 'asunto', etiqueta: 'Asunto', placeholder: 'p. ej. Información sobre la salida al museo', requerido: true },
      { id: 'cuerpo', etiqueta: 'Texto del comunicado', filas: 6, requerido: true, placeholder: 'Estimada familia, les comunico que…' },
    ],
    cuerpo: (alumno, datos) => [
      { t: 'p', texto: `Estimada familia de **${alumno}**:` },
      ...parrafos(datos.cuerpo),
      ...parrafos('Quedo a su disposición para cualquier aclaración en el teléfono y correo electrónico del centro.'),
    ],
  },
  {
    id: 'autorizacion',
    nombre: 'Autorización para actividad complementaria',
    emoji: '✅',
    resumen: 'Salidas, excursiones y actividades fuera del centro con consentimiento firmado.',
    campos: [
      { id: 'actividad', etiqueta: 'Actividad', placeholder: 'p. ej. Visita al Museo Arqueológico', requerido: true },
      { id: 'fechaActividad', etiqueta: 'Fecha de la actividad', requerido: true },
      { id: 'lugar', etiqueta: 'Lugar', placeholder: 'Ciudad / instalación', requerido: true },
      { id: 'transporte', etiqueta: 'Transporte', placeholder: 'Autocar, transporte público, a pie…' },
      { id: 'coste', etiqueta: 'Coste por alumno/a (€)' },
      { id: 'horario', etiqueta: 'Horario', placeholder: 'p. ej. de 9:00 a 14:00' },
      { id: 'observaciones', etiqueta: 'Consideraciones médicas o alimentarias', filas: 2 },
    ],
    cuerpo: (alumno, datos, perfil) => [
      ...parrafos(
        `Estimada familia de **${alumno}**:`,
        `El centro ${perfil.centro || '[Centro]'} ha organizado la actividad complementaria **«${datos.actividad}»**, que se realizará el **${fechaLarga(datos.fechaActividad)}** en **${datos.lugar}**${datos.horario ? `, en horario de ${datos.horario}` : ''}.`,
        datos.transporte ? `El desplazamiento se realizará mediante: ${datos.transporte}.` : '',
        datos.coste ? `El coste de la actividad es de **${datos.coste} €** por alumno/a.` : '',
        'Para la participación del alumno o alumna es imprescindible la autorización expresa de su representante legal, que se otorga firmando el presente documento.',
        'Los datos facilitados serán tratados únicamente para la gestión de esta actividad, conforme a la normativa de protección de datos.',
      ),
      ...(datos.observaciones
        ? parrafos(`**Consideraciones médicas o alimentarias del alumnado:** ${datos.observaciones}`)
        : []),
      {
        t: 'tabla',
        filas: [
          ['Deseo que mi hijo/a', 'SÍ asista ☐      NO asista ☐'],
          ['Nombre del/de la representante legal', ''],
          ['DNI', ''],
          ['Firma', ''],
        ],
      },
    ],
  },
  {
    id: 'citacion',
    nombre: 'Citación de tutoría',
    emoji: '🗓️',
    resumen: 'Cita formal con la familia para tratar la evolución del alumnado.',
    campos: [
      { id: 'fechaCita', etiqueta: 'Fecha de la reunión', requerido: true },
      { id: 'hora', etiqueta: 'Hora', placeholder: 'p. ej. 16:30', requerido: true },
      { id: 'lugarCita', etiqueta: 'Lugar', placeholder: 'p. ej. Despacho de tutoría / online' },
      { id: 'motivo', etiqueta: 'Motivo de la citación', filas: 4, requerido: true },
    ],
    cuerpo: (alumno, datos) => [
      ...parrafos(
        `Estimada familia de **${alumno}**:`,
        `Les cito a una reunión de tutoría el **${fechaLarga(datos.fechaCita)} a las ${datos.hora}**${datos.lugarCita ? ` en ${datos.lugarCita}` : ''}, para tratar los siguientes asuntos relacionados con la evolución educativa de su hijo/a:`,
        datos.motivo,
      ),
      ...parrafos(
        'Les rogamos confirmen su asistencia respondiendo a esta comunicación o llamando al centro. Si la fecha propuesta no les resulta posible, les invitamos a contactar con la tutoría para acordar otra.',
      ),
    ],
  },
  {
    id: 'faltas',
    nombre: 'Aviso por faltas de asistencia',
    emoji: '🚨',
    resumen: 'Comunicación formal de faltas acumuladas y solicitud de justificación.',
    campos: [
      { id: 'numFaltas', etiqueta: 'Nº de faltas injustificadas', requerido: true },
      { id: 'periodo', etiqueta: 'Período', placeholder: 'p. ej. durante el mes de noviembre', requerido: true },
      { id: 'norma', etiqueta: 'Norma o plan de convivencia aplicable', placeholder: 'p. ej. Plan de Convivencia del centro (punto X)' },
      { id: 'cierre', etiqueta: 'Plazo para justificar / citación', placeholder: 'p. ej. antes del viernes 20 o en tutoría' },
    ],
    cuerpo: (alumno, datos) => [
      ...parrafos(
        `Estimada familia de **${alumno}**:`,
        `Les comunicamos que su hijo/a ha acumulado **${datos.numFaltas} faltas de asistencia injustificadas** ${datos.periodo}.`,
        'La asistencia a las clases es obligatoria durante la escolarización, y las ausencias no justificadas pueden conllevar la aplicación de las medidas recogidas en el Plan de Convivencia del centro' +
          (datos.norma ? ` (${datos.norma})` : '') +
          ', así como afectar a la evaluación del alumnado conforme a la normativa vigente.',
        datos.cierre
          ? `Les solicitamos aportar la justificación correspondiente ${datos.cierre}.`
          : 'Les solicitamos aportar la justificación correspondiente a la mayor brevedad.',
      ),
    ],
  },
];

export const docFamiliasPorId = (id: string): DocFamiliasDef | undefined =>
  DOCS_FAMILIAS.find((d) => d.id === id);

/** Combina el documento de todos los alumnos (una página por alumno) */
export function construirLoteFamilias(
  def: DocFamiliasDef,
  alumnos: string[],
  datos: Record<string, string>,
  perfil: Perfil,
): { titulo: string; bloques: Bloque[] } {
  const fecha = datos.fecha || new Date().toISOString().slice(0, 10);
  const bloques: Bloque[] = [];
  alumnos.forEach((alumno, i) => {
    if (i > 0) bloques.push({ t: 'salto' });
    bloques.push(...cabecera(perfil, fecha));
    bloques.push({ t: 'h1', texto: def.nombre.toUpperCase() });
    if (datos.cursoGrupo) bloques.push({ t: 'p', texto: `${def.id === 'citacion' ? 'Tutoría' : 'Grupo'}: ${datos.cursoGrupo}`, clase: 'muted' });
    bloques.push(...def.cuerpo(alumno.trim(), datos, perfil));
    bloques.push(...despedida(perfil));
  });
  const titulo = `${def.nombre} — ${alumnos.length} ${alumnos.length === 1 ? 'copia' : 'copias'}`;
  return { titulo, bloques };
}
