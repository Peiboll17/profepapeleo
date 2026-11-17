import type { Bloque } from '../lib/doc';
import type { Perfil } from '../store/perfil';
import type { Ccaa } from './ccaa';
import { fechaLarga, hoyLarga } from '../lib/format';

/* ─── Tipos del asistente de trámites ─────────────────────────────── */

export type CampoTipo = 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox' | 'info';

export interface CampoDef {
  tipo: CampoTipo;
  id: string;
  etiqueta: string;
  placeholder?: string;
  ayuda?: string;
  requerido?: boolean;
  filas?: number;
  opciones?: { valor: string; etiqueta: string }[];
  /** Rellena el valor inicial desde el perfil del docente */
  dePerfil?: keyof Perfil;
  /** Bloque informativo (no es un campo) */
  html?: string;
  defecto?: string | number | boolean;
}

export interface PasoDef {
  titulo: string;
  campos: CampoDef[];
}

export interface TramiteContexto {
  perfil: Perfil;
  ccaa?: Ccaa;
}

export type DatosTramite = Record<string, string>;

export interface TramiteDef {
  id: string;
  nombre: string;
  resumen: string;
  emoji: string;
  /** Avisos y requisitos que se muestran antes de empezar */
  avisos?: string[];
  pasos: PasoDef[];
  /** Valores iniciales de los campos (autocompletado desde perfil/CCAA) */
  defectos?: (ctx: TramiteContexto) => DatosTramite;
  construir: (
    datos: DatosTramite,
    ctx: TramiteContexto,
  ) => { titulo: string; bloques: Bloque[] };
}

/* ─── Bloques comunes de un escrito administrativo ────────────────── */

function datosInteresado(p: Perfil): Bloque[] {
  const filas: string[][] = [['Nombre y apellidos', `${p.nombre} ${p.apellidos}`.trim()]];
  if (p.dni) filas.push(['DNI/NIF', p.dni]);
  if (p.cuerpo) filas.push(['Cuerpo', p.cuerpo]);
  if (p.especialidad) filas.push(['Especialidad', p.especialidad]);
  if (p.centro) filas.push(['Centro de destino', p.centro]);
  if (p.localidad) filas.push(['Localidad', p.localidad]);
  if (p.telefono) filas.push(['Teléfono', p.telefono]);
  if (p.email) filas.push(['Correo electrónico', p.email]);
  return [{ t: 'h3', texto: 'Datos de la persona interesada' }, { t: 'tabla', filas }];
}

function organoDestinatario(organo: string): Bloque[] {
  return organo
    ? [{ t: 'p', texto: `A la atención de:`, clase: 'muted' }, { t: 'p', texto: `**${organo.replace(/\n/g, ' — ')}**` }]
    : [];
}

function pieEscrito(localidad: string, p: Perfil, cargoFirma?: string): Bloque[] {
  return [
    { t: 'p', texto: `${localidad || '________________'}, ${hoyLarga()}`, clase: 'right' },
    { t: 'firma', nombre: `${p.nombre} ${p.apellidos}`.trim() || undefined, cargo: cargoFirma },
  ];
}

function sumarDiasNaturales(iso: string, dias: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y) return '';
  const f = new Date(y, m - 1, d + dias - 1);
  return `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`;
}

/* ─── Definición de trámites ──────────────────────────────────────── */

export const TRAMITES: TramiteDef[] = [
  /* 1 · Instancia genérica ─────────────────────────────────────────── */
  {
    id: 'instancia',
    nombre: 'Instancia / escrito genérico',
    resumen: 'Cualquier solicitud o escrito formal a la administración educativa.',
    emoji: '📄',
    pasos: [
      {
        titulo: 'Destinatario',
        campos: [
          {
            tipo: 'text',
            id: 'organo',
            etiqueta: 'Órgano al que se dirige',
            placeholder: 'Consejería / Dirección General / Dirección del centro…',
            requerido: true,
            ayuda: 'Consejo: los trámites de personal suelen dirigirse a la Dirección General de Personal de tu consejería; los escritos del centro, a su Dirección.',
          },
          {
            tipo: 'text',
            id: 'viaRegistro',
            etiqueta: 'Lugar de presentación (registro)',
            placeholder: 'Registro electrónico / Registro general de entrada…',
            defecto: 'Registro electrónico de la consejería competente',
          },
        ],
      },
      {
        titulo: 'Contenido',
        campos: [
          { tipo: 'text', id: 'asunto', etiqueta: 'Asunto', requerido: true, placeholder: 'Solicitud de…' },
          {
            tipo: 'textarea',
            id: 'expone',
            etiqueta: 'EXPONE (motivos y antecedentes)',
            filas: 6,
            requerido: true,
            placeholder: 'Expongo los hechos o motivos que fundamentan la solicitud…',
          },
          {
            tipo: 'textarea',
            id: 'solicita',
            etiqueta: 'SOLICITA (lo que se pide)',
            filas: 5,
            requerido: true,
            placeholder: 'Solicito que se me conceda / se dictamine / se informe sobre…',
          },
        ],
      },
    ],
    defectos: (ctx) => ({
      organo: ctx.ccaa ? `${ctx.ccaa.consejeria}\n${ctx.ccaa.direccionGeneral}` : '',
      ...(ctx.ccaa ? { viaRegistro: `Registro electrónico (${ctx.ccaa.sede})` } : {}),
    }),
    construir: (d, ctx) => ({
      titulo: d.asunto || 'Instancia',
      bloques: [
        ...organoDestinatario(d.organo),
        ...datosInteresado(ctx.perfil),
        { t: 'h3', texto: `Asunto: ${d.asunto}` },
        { t: 'h3', texto: 'EXPONE' },
        ...parrafosTexto(d.expone),
        { t: 'h3', texto: 'SOLICITA' },
        ...parrafosTexto(d.solicita),
        { t: 'p', texto: 'Es todo cuanto solicita, a los efectos oportunos.', clase: 'muted' },
        ...pieEscrito(ctx.perfil.localidad, ctx.perfil),
        ...notaRegistro(d.viaRegistro),
      ],
    }),
  },

  /* 2 · Permiso por asuntos propios ───────────────────────────────── */
  {
    id: 'asuntos-propios',
    nombre: 'Permiso por asuntos propios',
    resumen: 'Sin retribución, hasta 3 meses cada 2 años. Concesión discrecional.',
    emoji: '🌴',
    avisos: [
      'Requisito habitual: al menos **2 años de antigüedad** como funcionario de carrera (verifica tu normativa autonómica).',
      'Duración máxima **3 meses cada dos años**, sin retribución y con carácter **discrecional**: la administración puede denegarlo por necesidades del servicio.',
      'Suele exigirse presentarlo con **antelación mínima de 10 días hábiles** (algunas CCAA piden hasta 30).',
      'Los interinos y personal laboral se rigen por normativa distinta: consulta el procedimiento de tu comunidad.',
    ],
    pasos: [
      {
        titulo: 'Duración',
        campos: [
          { tipo: 'date', id: 'fechaInicio', etiqueta: 'Fecha de inicio', requerido: true },
          { tipo: 'number', id: 'dias', etiqueta: 'Duración en días naturales', requerido: true, defecto: 5, ayuda: 'Recuerda: el máximo acumulado es de 3 meses (≈90 días) cada dos años.' },
          {
            tipo: 'select',
            id: 'regimen',
            etiqueta: 'Régimen',
            defecto: 'completo',
            opciones: [
              { valor: 'completo', etiqueta: 'Jornada completa' },
              { valor: 'parcial', etiqueta: 'Jornada parcial (horas determinadas)' },
            ],
          },
          { tipo: 'date', id: 'fechaFinPrevista', etiqueta: 'Fecha fin prevista', ayuda: 'Si la dejas vacía se calcula automáticamente.' },
          { tipo: 'text', id: 'cobertura', etiqueta: 'Propuesta de cobertura (opcional)', placeholder: 'Suerte de servicio, guardia, sustitución…' },
        ],
      },
      {
        titulo: 'Base legal',
        campos: [
          {
            tipo: 'textarea',
            id: 'refLegal',
            etiqueta: 'Fundamento legal (precargado según tu comunidad)',
            filas: 3,
            defecto:
              'El artículo 89.3.b) del texto refundido de la Ley del Estatuto Básico del Empleado Público (Real Decreto Legislativo 5/2015, de 30 de octubre) y la normativa autonómica aplicable en materia de permisos y licencias del personal docente.',
          },
        ],
      },
    ],
    defectos: ({ ccaa }): DatosTramite =>
      ccaa?.normativa?.permisos
        ? {
            refLegal: `El artículo 89.3.b) del texto refundido de la Ley del Estatuto Básico del Empleado Público (Real Decreto Legislativo 5/2015, de 30 de octubre) y ${ccaa.normativa.permisos}.`,
          }
        : {},
    construir: (d, ctx) => {
      const fin = d.fechaFinPrevista || (d.fechaInicio && d.dias ? sumarDiasNaturales(d.fechaInicio, Number(d.dias)) : '');
      const regimen = d.regimen === 'parcial' ? 'con jornada parcial' : 'con jornada completa';
      return {
        titulo: 'Permiso por asuntos propios',
        bloques: [
          { t: 'h1', texto: 'SOLICITUD DE PERMISO POR ASUNTOS PROPIOS' },
          ...datosInteresado(ctx.perfil),
          { t: 'h3', texto: 'EXPONE' },
          ...parrafosTexto(
            `Que presta servicios como ${ctx.perfil.cuerpo || 'personal docente'}${
              ctx.perfil.especialidad ? ` (${ctx.perfil.especialidad})` : ''
            } en el centro ${ctx.perfil.centro || 'de destino'}, con destino definitivo.`,
            `Que le ampara el derecho reconocido en ${d.refLegal}`,
            'Que no se encuentra incurso en incompatibilidad alguna y que concurren en su caso los requisitos exigidos para el permiso que solicita.',
          ),
          { t: 'h3', texto: 'SOLICITA' },
          ...parrafosTexto(
            `Que le sea concedido permiso por asuntos propios, ${regimen} y sin retribución, por **${d.dias} días naturales**, con efecto desde el **${fechaLarga(d.fechaInicio)}** hasta el **${fechaLarga(fin)}** (ambos inclusive).${
              d.cobertura ? `\nA tal efecto, propone como medida de cobertura del servicio: ${d.cobertura}.` : ''
            }`,
          ),
          { t: 'p', texto: 'Es todo cuanto solicita, a los efectos oportunos.', clase: 'muted' },
          ...pieEscrito(ctx.perfil.localidad, ctx.perfil),
        ],
      };
    },
  },

  /* 3 · Licencia por formación ────────────────────────────────────── */
  {
    id: 'formacion',
    nombre: 'Licencia por formación',
    resumen: 'Para cursos, jornadas o masters relacionados con tu puesto.',
    emoji: '🎓',
    avisos: [
      'Cada comunidad regula su propio procedimiento (permiso para actividades de formación, asistencia a jornadas…): verifica la instrucción o circular vigente.',
      'La concesión es discrecional y está subordinada a las **necesidades del servicio**; conviene solicitarla con la máxima antelación posible.',
      'Suele exigirse acreditar la admisión al curso o actividad antes de la concesión definitiva.',
    ],
    pasos: [
      {
        titulo: 'Actividad formativa',
        campos: [
          { tipo: 'text', id: 'actividad', etiqueta: 'Nombre del curso / actividad', requerido: true },
          { tipo: 'text', id: 'organizador', etiqueta: 'Entidad organizadora', requerido: true, placeholder: 'Universidad, centro de profesorado, institución…' },
          {
            tipo: 'select',
            id: 'modalidad',
            etiqueta: 'Modalidad',
            defecto: 'presencial',
            opciones: [
              { valor: 'presencial', etiqueta: 'Presencial' },
              { valor: 'online', etiqueta: 'En línea (síncrona)' },
              { valor: 'hibrida', etiqueta: 'Híbrida' },
            ],
          },
          { tipo: 'number', id: 'horas', etiqueta: 'Duración en horas', requerido: true },
          { tipo: 'date', id: 'fechaInicio', etiqueta: 'Fecha de inicio', requerido: true },
          { tipo: 'date', id: 'fechaFin', etiqueta: 'Fecha de fin', requerido: true },
          { tipo: 'text', id: 'lugar', etiqueta: 'Lugar de celebración', placeholder: 'Ciudad / plataforma' },
        ],
      },
      {
        titulo: 'Justificación',
        campos: [
          {
            tipo: 'textarea',
            id: 'justificacion',
            etiqueta: 'Justificación de la solicitud',
            filas: 4,
            placeholder: 'Relación de la actividad con tu puesto de trabajo o con la mejora de la práctica docente…',
          },
          {
            tipo: 'textarea',
            id: 'refLegal',
            etiqueta: 'Fundamento legal (precargado según tu comunidad)',
            filas: 3,
            defecto:
              'El artículo 90 del texto refundido de la Ley del Estatuto Básico del Empleado Público (Real Decreto Legislativo 5/2015, de 30 de octubre) y la normativa autonómica en materia de formación del profesorado.',
          },
        ],
      },
    ],
    defectos: ({ ccaa }): DatosTramite =>
      ccaa?.normativa?.permisos
        ? {
            refLegal: `El artículo 90 del texto refundido de la Ley del Estatuto Básico del Empleado Público (Real Decreto Legislativo 5/2015, de 30 de octubre) y ${ccaa.normativa.permisos}.`,
          }
        : {},
    construir: (d, ctx) => ({
      titulo: `Licencia por formación — ${d.actividad || ''}`.trim(),
      bloques: [
        { t: 'h1', texto: 'SOLICITUD DE LICENCIA POR FORMACIÓN' },
        ...datosInteresado(ctx.perfil),
        { t: 'h3', texto: 'EXPONE' },
        ...parrafosTexto(
          `Que tiene conocimiento de la celebración de la actividad formativa **«${d.actividad}»**, organizada por ${d.organizador || '________'}, en modalidad ${d.modalidad}${
            d.lugar ? `, con lugar de celebración en ${d.lugar}` : ''
          }.`,
          `La actividad tiene una duración de **${d.horas} horas** y se celebrará del **${fechaLarga(d.fechaInicio)}** al **${fechaLarga(d.fechaFin)}**.`,
          d.justificacion ? `Que la actividad se justifica por la siguiente razón: ${d.justificacion}` : '',
          `Que le ampara lo dispuesto en ${d.refLegal}`,
        ),
        { t: 'h3', texto: 'SOLICITA' },
        ...parrafosTexto(
          `Que le sea concedida licencia por formación para asistir a la actividad descrita durante los días indicados, con los efectos administrativos y económicos que correspondan conforme a la normativa aplicable.`,
          'Asimismo, solicita que se tenga por aportada, en su caso, la documentación acreditativa de la admisión a la actividad, que se adjunta a la presente solicitud.',
        ),
        { t: 'p', texto: 'Es todo cuanto solicita, a los efectos oportunos.', clase: 'muted' },
        ...pieEscrito(ctx.perfil.localidad, ctx.perfil),
      ],
    }),
  },

  /* 4 · Comunicación de baja médica ───────────────────────────────── */
  {
    id: 'enfermedad',
    nombre: 'Comunicación de baja médica',
    resumen: 'Comunica a la dirección del centro tu incapacidad temporal.',
    emoji: '🤒',
    avisos: [
      'Este escrito se presenta ante la **dirección del centro**; el parte médico oficial se entrega además por el cauce que indique tu consejería (algunas lo exigen en 24-48 h).',
      'Si la baja se prolonga, recuerda remitir los **partes de confirmación** en los plazos establecidos.',
    ],
    pasos: [
      {
        titulo: 'Datos de la baja',
        campos: [
          { tipo: 'date', id: 'fechaInicio', etiqueta: 'Fecha de efecto de la baja', requerido: true },
          {
            tipo: 'select',
            id: 'causa',
            etiqueta: 'Causa',
            defecto: 'comun',
            opciones: [
              { valor: 'comun', etiqueta: 'Enfermedad común' },
              { valor: 'profesional', etiqueta: 'Enfermedad profesional / accidente de trabajo' },
              { valor: 'accidente', etiqueta: 'Accidente no laboral' },
            ],
          },
          { tipo: 'number', id: 'duracionEstimada', etiqueta: 'Duración estimada (días)', placeholder: 'Según el parte médico' },
          {
            tipo: 'checkbox',
            id: 'adjuntaParte',
            etiqueta: 'Adjunto copia del parte médico de baja',
            defecto: true,
          },
          {
            tipo: 'text',
            id: 'refLegal',
            etiqueta: 'Fundamento legal',
            defecto: 'artículo 90.1.a) del RD Legislativo 5/2015 (EBEP)',
          },
        ],
      },
    ],
    construir: (d, ctx) => ({
      titulo: 'Comunicación de baja médica',
      bloques: [
        { t: 'h1', texto: 'COMUNICACIÓN DE INCAPACIDAD TEMPORAL' },
        { t: 'p', texto: `A la dirección del centro ${ctx.perfil.centro || 'de destino'}.`, clase: 'muted' },
        ...datosInteresado(ctx.perfil),
        { t: 'h3', texto: 'COMUNICA' },
        ...parrafosTexto(
          `Que con fecha **${fechaLarga(d.fechaInicio)}** le ha sido expedido parte médico de baja por ${
            d.causa === 'comun'
              ? 'enfermedad común'
              : d.causa === 'profesional'
                ? 'enfermedad profesional / accidente de trabajo'
                : 'accidente no laboral'
          }${
            d.duracionEstimada ? `, con una duración estimada de ${d.duracionEstimada} días` : ''
          }, por lo que se encuentra en situación de incapacidad temporal.`,
          `Que, amparado en el ${d.refLegal}, remite la presente comunicación a los efectos oportunos${
            d.adjuntaParte ? ', adjuntando copia del citado parte médico' : ''
          }.`,
          'Que se compromete a hacer llegar a esta dirección, en su caso, los sucesivos partes médicos de confirmación, así como el parte de alta en el momento en que se produzca.',
        ),
        ...pieEscrito(ctx.perfil.localidad, ctx.perfil),
      ],
    }),
  },

  /* 5 · Escrito a inspección educativa ────────────────────────────── */
  {
    id: 'inspeccion',
    nombre: 'Escrito a la inspección educativa',
    resumen: 'Trasladar hechos o solicitar la intervención de inspección.',
    emoji: '🔍',
    avisos: [
      'Dirige el escrito al **Servicio de Inspección** de tu dirección de área territorial o provincial.',
      'Describe los hechos de forma objetiva y cronológica; aporta fechas y, si los tienes, los datos del centro y las personas implicadas.',
    ],
    pasos: [
      {
        titulo: 'Destinatario y asunto',
        campos: [
          {
            tipo: 'text',
            id: 'organo',
            etiqueta: 'Órgano de inspección',
            requerido: true,
            placeholder: 'Servicio de Inspección de Educación de…',
          },
          { tipo: 'text', id: 'asunto', etiqueta: 'Asunto', requerido: true, placeholder: 'Hechos acontecidos en… / Solicitud de intervención en…' },
        ],
      },
      {
        titulo: 'Contenido',
        campos: [
          {
            tipo: 'textarea',
            id: 'hechos',
            etiqueta: 'HECHOS (objetivos y cronológicos)',
            filas: 8,
            requerido: true,
            placeholder: 'Primero…\nSegundo…\nTercero…',
          },
          {
            tipo: 'textarea',
            id: 'peticion',
            etiqueta: 'PETICIÓN',
            filas: 4,
            requerido: true,
            placeholder: 'Solicito que por ese Servicio de Inspección se…',
          },
        ],
      },
    ],
    defectos: (ctx) => ({
      organo: `Servicio de Inspección de Educación\n${ctx.ccaa ? `${ctx.ccaa.consejeria}\n${ctx.ccaa.direccionGeneral}` : ''}`,
    }),
    construir: (d, ctx) => ({
      titulo: d.asunto || 'Escrito a inspección',
      bloques: [
        ...organoDestinatario(d.organo),
        ...datosInteresado(ctx.perfil),
        { t: 'h3', texto: `Asunto: ${d.asunto}` },
        { t: 'h3', texto: 'EXPONE' },
        ...parrafosTexto(d.hechos),
        { t: 'h3', texto: 'SOLICITA' },
        ...parrafosTexto(d.peticion),
        { t: 'p', texto: 'Por la atención prestada, agradezco de antemano la atención que se digne prestar al presente escrito.', clase: 'muted' },
        ...pieEscrito(ctx.perfil.localidad, ctx.perfil),
      ],
    }),
  },

  /* 6 · Solicitud de sexenio ─────────────────────────────────────── */
  {
    id: 'sexenios',
    nombre: 'Solicitud de sexenio (tramo docencia)',
    resumen: 'Reconocimiento de tramo docente. Solo se concede si lo pides.',
    emoji: '🏅',
    avisos: [
      '**Nadie te avisa**: los sexenios solo se reconocen a solicitud de la persona interesada. Ojo a las convocatorias anuales de tu comunidad.',
      'Requisito: **6 años de actividad docente** desde el nombramiento o desde el último sexenio reconocido, con la actividad en servicio activo.',
      'Cada convocatoria exige acreditar **formación** (según comunidad, del orden de 60-100 horas, de perfeccionamiento o actividad investigadora): revisa la orden de convocatoria.',
      'Los **trienios** (antigüedad) se reconocen de oficio: no requieren solicitud salvo servicios previos en otra administración.',
    ],
    pasos: [
      {
        titulo: 'Tramo y periodos',
        campos: [
          { tipo: 'date', id: 'nombramiento', etiqueta: 'Fecha de primer nombramiento', dePerfil: 'fechaNombramiento' },
          { tipo: 'number', id: 'numTramo', etiqueta: 'Nº de tramo (sexenio) que solicitas', defecto: 1 },
          { tipo: 'date', id: 'periodoInicio', etiqueta: 'Inicio del período computable', requerido: true },
          { tipo: 'date', id: 'periodoFin', etiqueta: 'Fin del período computable', requerido: true },
          { tipo: 'number', id: 'horasFormacion', etiqueta: 'Horas de formación acreditadas', requerido: true, placeholder: 'p. ej. 100' },
          {
            tipo: 'textarea',
            id: 'cursos',
            etiqueta: 'Cursos y actividades de formación acreditadas',
            filas: 5,
            placeholder: 'Nombre del curso, entidad, horas y año — una línea por curso',
          },
        ],
      },
      {
        titulo: 'Base legal',
        campos: [
          {
            tipo: 'textarea',
            id: 'refLegal',
            etiqueta: 'Convocatoria y fundamento legal (precargado según tu comunidad)',
            filas: 3,
            defecto:
              'El Real Decreto 1086/1989, de 28 de agosto, sobre retribuciones del profesorado, y la orden de convocatoria vigente de reconocimiento de tramos de la comunidad autónoma.',
          },
        ],
      },
    ],
    defectos: ({ ccaa }): DatosTramite => {
      const ref = ccaa?.normativa?.sexenios;
      return ref
        ? {
            refLegal: `El Real Decreto 1086/1989, de 28 de agosto, sobre retribuciones del profesorado, y ${ref}.`,
          }
        : {};
    },
    construir: (d, ctx) => ({
      titulo: `Solicitud de sexenio — tramo nº ${d.numTramo || 1}`,
      bloques: [
        { t: 'h1', texto: 'SOLICITUD DE RECONOCIMIENTO DE TRAMO DOCENTE (SEXENIO)' },
        ...datosInteresado(ctx.perfil),
        { t: 'h3', texto: 'EXPONE' },
        ...parrafosTexto(
          `Que presta servicios como ${ctx.perfil.cuerpo || 'personal docente'} en el centro ${ctx.perfil.centro || 'de destino'}.`,
          `Que acredita **6 años de efectiva actividad docente** en el período comprendido entre el **${fechaLarga(d.periodoInicio)}** y el **${fechaLarga(d.periodoFin)}**, computables para el reconocimiento del tramo nº ${d.numTramo || 1} de docencia.`,
          `Que acredita **${d.horasFormacion} horas** de formación o perfeccionamiento, detalladas a continuación:${d.cursos ? `\n${d.cursos}` : ''}`,
          `Que se ajusta a lo dispuesto en ${d.refLegal}`,
        ),
        { t: 'h3', texto: 'SOLICITA' },
        ...parrafosTexto(
          `Que le sea reconocido el tramo nº ${d.numTramo || 1} de docencia (sexenio) por el período indicado, con los efectos económicos y administrativos que legalmente correspondan.`,
          'Asimismo, solicita que se tenga por aportada la documentación acreditativa que se adjunta (certificados de servicios prestados, certificados de cursos y demás méritos).',
        ),
        { t: 'p', texto: 'Es todo cuanto solicita, a los efectos oportunos.', clase: 'muted' },
        ...pieEscrito(ctx.perfil.localidad, ctx.perfil),
      ],
    }),
  },
];

export const tramitePorId = (id: string): TramiteDef | undefined => TRAMITES.find((t) => t.id === id);

/** Convierte uno o varios textos (con posibles saltos) en párrafos; ignora vacíos */
function parrafosTexto(...textos: string[]): Bloque[] {
  return textos
    .filter((t) => String(t ?? '').trim())
    .flatMap<Bloque>((texto) =>
      String(texto)
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => {
          const lineas = p.split('\n').map((l) => l.trim()).filter(Boolean);
          return { t: 'p', texto: lineas.length > 1 ? lineas.join(' ') : p };
        }),
    );
}

function notaRegistro(via: string): Bloque[] {
  if (!via) return [];
  return [
    { t: 'salto' },
    { t: 'p', texto: '— — —', clase: 'center' },
    { t: 'p', texto: `Lugar de presentación: ${via}`, clase: 'muted' },
    { t: 'p', texto: `Fecha de la presentación: ${hoyLarga()}`, clase: 'muted' },
    { t: 'p', texto: 'Sello / referencia de registro: ______________________', clase: 'muted' },
  ];
}
