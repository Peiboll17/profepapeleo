export interface NormativaCcaa {
  /** Decretos de currículo LOMLOE de la comunidad (verificados a fecha 2026; pueden cambiar) */
  curriculo?: {
    /** Decreto único para primaria + ESO (p. ej. Cataluña "educación básica") */
    basica?: string;
    infantil?: string;
    primaria?: string;
    eso?: string;
    bachillerato?: string;
  };
  /** Norma de evaluación de las etapas */
  evaluacion?: string;
  /** Norma autonómica de permisos y licencias del personal docente */
  permisos?: string;
  /** Norma o procedimiento de reconocimiento de sexenios/tramos */
  sexenios?: string;
  /** Norma de organización y funcionamiento de los centros */
  organizacion?: string;
  /** Peculiaridades que la app muestra al docente */
  notas?: string[];
}

export interface Ccaa {
  id: string;
  nombre: string;
  /** Consejería/Departamento de Educación (verificar: cambian con los gobiernos) */
  consejeria: string;
  /** Órgano habitual para trámites de personal docente */
  direccionGeneral: string;
  /** URL de la sede electrónica / registro electrónico */
  sede: string;
  /** Normativa educativa propia de la comunidad (educación = competencia transferida) */
  normativa?: NormativaCcaa;
}

/**
 * Datos orientativos a fecha de 2025. Los nombres de consejerías y las normas
 * cambian con los gobiernos: la app permite editarlos en Ajustes y recuerda
 * verificarlos antes de registrar un escrito. Las citas legales precargadas
 * se han contrastado con fuentes oficiales (BOJA, BOCM, DOG, DOGV, DOGC…);
 * las comunidades sin normativa precargada muestran marcadores [Completar: …].
 */
export const CCAA: Ccaa[] = [
  {
    id: 'andalucia',
    nombre: 'Andalucía',
    consejeria: 'Consejería de Desarrollo Educativo y Formación Profesional',
    direccionGeneral: 'Dirección General de Gestión de Recursos Humanos',
    sede: 'https://juntadeandalucia.es/sede',
    normativa: {
      curriculo: {
        primaria: 'Decreto 101/2023, de 9 de mayo, por el que se establece la ordenación y el currículo de Educación Primaria',
        eso: 'Decreto 102/2023, de 9 de mayo, por el que se establece la ordenación y el currículo de la ESO',
        bachillerato: 'Decreto 103/2023, de 9 de mayo, por el que se establece la ordenación y el currículo de Bachillerato',
      },
      evaluacion: 'Órdenes de 30 de mayo de 2023, por las que se desarrolla el currículo de la etapa y se regula la evaluación',
      organizacion: 'Decreto 327/2011, de 5 de julio, por el que se regula el Plan de Centro (PEC, ROF y Proyecto de Gestión)',
      sexenios: 'la normativa de la Junta de Andalucía de reconocimiento de tramos (convocatoria anual con requisitos de formación)',
      notas: [
        'El Plan de Centro (PEC, ROF y Proyecto de Gestión) se regula en el Decreto 327/2011 y sus instrucciones anuales.',
        'Las programaciones didácticas se incluyen en la PGA, que aprueba el Consejo Escolar.',
      ],
    },
  },
  {
    id: 'aragon',
    nombre: 'Aragón',
    consejeria: 'Departamento de Educación, Cultura y Deporte',
    direccionGeneral: 'Dirección General de Personal y Elevación de la Calidad Educativa',
    sede: 'https://aragon.es/tramites',
    normativa: {
      curriculo: {
        primaria: 'Orden ECD/1112/2022, de 18 de julio, por la que se aprueba el currículo de Educación Primaria',
        eso: 'Orden ECD/853/2022, de 13 de junio, por la que se aprueba el currículo de la ESO',
        bachillerato: 'Orden ECD/1173/2022, de 3 de agosto, por la que se establece la ordenación y se aprueba el currículo de Bachillerato',
      },
      evaluacion: 'Orden ECD/518/2022, de 22 de abril, de desarrollo de los requisitos básicos de evaluación',
      notas: [
        'Aragón regula el currículo mediante órdenes del Departamento (BOA), no mediante decretos.',
      ],
    },
  },
  {
    id: 'asturias',
    nombre: 'Asturias',
    consejeria: 'Consejería de Educación, Ciencia, Cultura y Deporte',
    direccionGeneral: 'Dirección General de Personal Docente',
    sede: 'https://sede.asturias.es',
    normativa: {
      curriculo: {
        primaria: 'Decreto 57/2022, de 5 de agosto, por el que se regula la ordenación y se establece el currículo de Educación Primaria',
        eso: 'Decreto 59/2022, de 30 de agosto, por el que se regula la ordenación y se establece el currículo de la ESO',
        bachillerato: 'Decreto 60/2022, de 30 de agosto, por el que se regula la ordenación y se establece el currículo de Bachillerato',
      },
    },
  },
  {
    id: 'baleares',
    nombre: 'Illes Balears',
    consejeria: "Conselleria d'Educació i Universitats",
    direccionGeneral: 'Direcció General de Personal Docent',
    sede: 'https://seu.caib.es',
    normativa: {
      curriculo: {
        primaria: 'Decreto 33/2022, de 1 de agosto, de currículo de las enseñanzas de Infantil y Primaria',
        eso: 'Decreto 42/2025, de 1 de agosto, de ordenación y currículo de la ESO',
        bachillerato: 'Decreto 43/2025, de 1 de agosto, de ordenación y currículo de Bachillerato',
      },
      notas: [
        'Los decretos de ESO y Bachillerato fueron sustituidos en agosto de 2025 (Decreto 42/2025 y 43/2025, en lugar de los de 2022).',
      ],
    },
  },
  {
    id: 'canarias',
    nombre: 'Canarias',
    consejeria: 'Consejería de Educación, Formación Profesional, Actividad Física y Deportes',
    direccionGeneral: 'Dirección General de Personal Docente',
    sede: 'https://sede.gobcan.es',
    normativa: {
      curriculo: {
        primaria: 'Decreto 211/2022, de 10 de noviembre, por el que se establece la ordenación y el currículo de Educación Primaria',
        eso: 'Decreto 30/2023, de 16 de marzo, por el que se establecen la ordenación y el currículo de la ESO y del Bachillerato',
        bachillerato: 'Decreto 30/2023, de 16 de marzo, por el que se establecen la ordenación y el currículo de la ESO y del Bachillerato',
      },
      evaluacion: 'Orden de 24 de mayo de 2022, por la que se regula la evaluación y promoción con la implantación de las modificaciones de la LOMLOE',
      permisos: 'el régimen de permisos y licencias del personal docente de Canarias (normativa clasificada de la Dirección General de Personal)',
      notas: [
        'Un único decreto (30/2023) cubre el currículo de la ESO y del Bachillerato.',
        'La Consejería publica su normativa de permisos y licencias clasificada y actualizada en su web (Inspección de Educación).',
      ],
    },
  },
  {
    id: 'cantabria',
    nombre: 'Cantabria',
    consejeria: 'Consejería de Educación y Formación Profesional',
    direccionGeneral: 'Dirección General de Personal Docente',
    sede: 'https://sedecantabria.com',
    normativa: {
      curriculo: {
        primaria: 'Decreto 66/2022, de 7 de julio, por el que se establece el currículo de Educación Infantil y Primaria',
        eso: 'Decreto 73/2022, de 27 de julio, por el que se establece el currículo de la ESO y del Bachillerato',
        bachillerato: 'Decreto 73/2022, de 27 de julio, por el que se establece el currículo de la ESO y del Bachillerato',
      },
      notas: [
        'Un único decreto (73/2022) cubre el currículo de la ESO y del Bachillerato.',
      ],
    },
  },
  {
    id: 'cyl',
    nombre: 'Castilla y León',
    consejeria: 'Consejería de Educación',
    direccionGeneral: 'Dirección General de Recursos Humanos',
    sede: 'https://www.tramitacastillayleon.jcyl.es',
    normativa: {
      curriculo: {
        primaria: 'Decreto 38/2022, de 29 de septiembre, por el que se establece la ordenación y el currículo de Educación Primaria',
        eso: 'Decreto 39/2022, de 29 de septiembre, por el que se establece la ordenación y el currículo de la ESO',
        bachillerato: 'Decreto 40/2022, de 29 de septiembre, por el que se establece la ordenación y el currículo de Bachillerato',
      },
    },
  },
  {
    id: 'clm',
    nombre: 'Castilla-La Mancha',
    consejeria: 'Consejería de Educación, Cultura y Deportes',
    direccionGeneral: 'Dirección General de Recursos Humanos y Planificación Educativa',
    sede: 'https://tributos.castillalamancha.es',
    normativa: {
      curriculo: {
        primaria: 'Decreto 81/2022, de 12 de julio, por el que se establece la ordenación y el currículo de Educación Primaria',
        eso: 'Decreto 82/2022, de 12 de julio, por el que se establece la ordenación y el currículo de la ESO',
        bachillerato: 'Decreto 83/2022, de 12 de julio, por el que se establece la ordenación y el currículo de Bachillerato',
      },
      sexenios: 'la Orden EDU/1051/2021, de 15 de septiembre, por la que se regulan los sexenios y la carrera profesional',
      notas: [
        'El docente opta entre carrera profesional y sexenios: son incompatibles entre sí (Orden EDU/1051/2021).',
        'La ordenación y el currículo de Bachillerato se actualizaron con el Decreto 19/2024 (Bachillerato General y de Artes).',
      ],
    },
  },
  {
    id: 'catalunya',
    nombre: 'Cataluña',
    consejeria: "Departament d'Educació i Formació Professional",
    direccionGeneral: 'Direcció General de Personal',
    sede: 'https://seu.gencat.cat',
    normativa: {
      curriculo: {
        basica: 'Decret 175/2022, de 27 de septiembre, d’ordenació de les ensenyances de l’educació bàsica (primaria y ESO)',
        bachillerato: 'Decret 176/2022, de 27 de septiembre, de ordenación del Bachillerato',
      },
      notas: [
        'El Decret 175/2022 regula la educación básica (primaria y ESO) en un solo decreto, con currículo competencial e indicadores.',
      ],
    },
  },
  {
    id: 'valencia',
    nombre: 'Comunitat Valenciana',
    consejeria: "Conselleria d'Educació, Universitats i Ocupació",
    direccionGeneral: 'Direcció General de Personal Docent',
    sede: 'https://www.gva.es',
    normativa: {
      curriculo: {
        primaria: 'Decreto 106/2022, de 5 de agosto, por el que se establece la ordenación y el currículo de Educación Primaria',
        eso: 'Decreto 107/2022, de 5 de agosto, por el que se establece la ordenación y el currículo de la ESO',
        bachillerato: 'Decreto 108/2022, de 5 de agosto, por el que se establece la ordenación y el currículo de Bachillerato',
      },
      evaluacion: 'Orden 19/2023, de 29 de junio, de evaluación y promoción',
      sexenios: 'el procedimiento de reconocimiento de sexenios de la Generalitat (se reconocen de oficio al funcionariado de carrera)',
      notas: [
        'Los sexenios se reconocen de oficio conforme al decreto publicado en el DOCV.',
        'El personal interino acredita 100 horas de formación (desde el 1/3/2017) para percibir el segundo sexenio en adelante.',
      ],
    },
  },
  {
    id: 'extremadura',
    nombre: 'Extremadura',
    consejeria: 'Consejería de Educación y Formación Profesional',
    direccionGeneral: 'Dirección General de Personal Docente',
    sede: 'https://sede.gobex.es',
    normativa: {
      curriculo: {
        primaria: 'Decreto 107/2022, de 28 de julio, por el que se establece la ordenación y el currículo de Educación Primaria',
        eso: 'Decreto 110/2022, de 22 de agosto, por el que se establece la ordenación y el currículo de la ESO',
        bachillerato: 'Decreto 109/2022, de 22 de agosto, por el que se establece la ordenación y el currículo de Bachillerato',
      },
      notas: [
        'El decreto de Bachillerato fue modificado por el Decreto 73/2025, de 8 de julio.',
      ],
    },
  },
  {
    id: 'galicia',
    nombre: 'Galicia',
    consejeria: 'Consellería de Educación, Ciencia, Universidades e Formación Profesional',
    direccionGeneral: 'Dirección Xeral de Centros e Recursos Humanos',
    sede: 'https://sede.xunta.gal',
    normativa: {
      curriculo: {
        primaria: 'Decreto 155/2022, de 15 de septiembre, de ordenación e currículo da Educación Primaria',
        eso: 'Decreto 156/2022, de 15 de septiembre, de ordenación e currículo da ESO',
        bachillerato: 'Decreto 157/2022, de 15 de septiembre, de ordenación e currículo do Bacharelato',
      },
      evaluacion: 'Órdenes de desarrollo del currículo y evaluación (p. ej. Orden de 26 de mayo de 2023 para la ESO)',
      permisos: 'la Orden de 29 de enero de 2016 (DOG nº 30, de 15/02/2016), que regula el régimen de permisos, licencias y vacaciones del personal docente',
      notas: [
        'Asuntos propios: sin retribución, máximo 3 meses acumulados cada dos años (Orden de 29/1/2016).',
      ],
    },
  },
  {
    id: 'madrid',
    nombre: 'Comunidad de Madrid',
    consejeria: 'Consejería de Educación, Ciencia y Universidades',
    direccionGeneral: 'Dirección General de Recursos Humanos',
    sede: 'https://sede.madrid.org',
    normativa: {
      curriculo: {
        primaria: 'Decreto 61/2022, de 13 de julio (BOCM 18/07/2022), de ordenación y currículo de Educación Primaria',
        eso: 'Decreto 65/2022, de 20 de julio, de ordenación y currículo de la ESO',
        bachillerato: 'Decreto 64/2022, de 20 de julio, de ordenación y currículo de Bachillerato',
      },
      permisos: 'el Manual de permisos y licencias del personal docente de la Comunidad de Madrid (comunidad.madrid/educacion/manual-permisos-licencias-docentes)',
      notas: [
        'Los trámites de personal se registran en la sede electrónica de la Comunidad de Madrid (sede.madrid.org).',
      ],
    },
  },
  {
    id: 'murcia',
    nombre: 'Región de Murcia',
    consejeria: 'Consejería de Educación, Formación Profesional y Empleo',
    direccionGeneral: 'Dirección General de Recursos Humanos y Función Pública',
    sede: 'https://sede.carm.es',
    normativa: {
      curriculo: {
        primaria: 'Decreto de currículo de Educación Primaria de la Región de Murcia (BORM nº 267, de 18/11/2022)',
        eso: 'Decreto de currículo de la ESO de la Región de Murcia (BORM nº 283, de 09/12/2022)',
        bachillerato: 'Decreto nº 251/2022, de 22 de diciembre, por el que se establece la ordenación y el currículo de Bachillerato',
      },
      sexenios: 'la Orden de 8 de octubre de 2008, de regulación de la formación permanente del profesorado (base del reconocimiento de tramos)',
      notas: [
        'Los trienios y los sexenios de los Maestros se reconocen de oficio por la administración.',
        'Las instancias de reconocimiento se presentan en la Sede Electrónica de la CARM (sede.carm.es).',
      ],
    },
  },
  {
    id: 'navarra',
    nombre: 'Comunidad Foral de Navarra',
    consejeria: 'Departamento de Educación',
    direccionGeneral: 'Dirección General de Personal y Docencia',
    sede: 'https://www.navarra.es',
    normativa: {
      curriculo: {
        primaria: 'Decreto Foral 67/2022, por el que se establece el currículo de Educación Primaria',
        eso: 'Decreto Foral 71/2022, de 29 de junio, por el que se establece el currículo de la ESO',
        bachillerato: 'Decreto Foral 72/2022, de 29 de junio, por el que se establece el currículo de Bachillerato',
      },
    },
  },
  {
    id: 'euskadi',
    nombre: 'País Vasco',
    consejeria: 'Hezkuntza Saila / Departamento de Educación',
    direccionGeneral: 'Personaleko Zuzendaritza Nagusia / Dirección General de Personal',
    sede: 'https://euskadi.eus',
    normativa: {
      curriculo: {
        basica: 'Decreto 77/2023, de 30 de mayo, por el que se establece el currículo de la Educación Básica (primaria y ESO)',
        bachillerato: 'Decreto 76/2023, de 30 de mayo, por el que se establece el currículo de Bachillerato',
      },
      notas: [
        'El Decreto 77/2023 regula la educación básica (primaria, ESO y educación especial básica) en un solo decreto.',
      ],
    },
  },
  {
    id: 'rioja',
    nombre: 'La Rioja',
    consejeria: 'Consejería de Educación, Formación y Empleo',
    direccionGeneral: 'Dirección General de Educación, Cultura, Deporte y Juventud',
    sede: 'https://www.larioja.org',
    normativa: {
      curriculo: {
        primaria: 'Decreto 41/2022, de 13 de julio, por el que se establece el currículo de Educación Primaria',
        eso: 'Decreto 38/2022, por el que se establece el currículo de la ESO y se regula su organización y evaluación',
        bachillerato: 'Decreto 43/2022, de 21 de julio, por el que se establece el currículo de Bachillerato',
      },
    },
  },
  {
    id: 'ceuta',
    nombre: 'Ceuta',
    consejeria: 'Ministerio de Educación, Formación Profesional y Deportes (Dirección Provincial de Ceuta)',
    direccionGeneral: 'Dirección Provincial de Educación de Ceuta',
    sede: 'https://sede.educacion.gob.es',
    normativa: {
      notas: [
        'Ceuta se gestiona por el Ministerio de Educación: no hay decreto autonómico y se aplican directamente los reales decretos estatales.',
        'Los trámites se registran en la sede electrónica del Ministerio (sede.educacion.gob.es).',
      ],
    },
  },
  {
    id: 'melilla',
    nombre: 'Melilla',
    consejeria: 'Ministerio de Educación, Formación Profesional y Deportes (Dirección Provincial de Melilla)',
    direccionGeneral: 'Dirección Provincial de Educación de Melilla',
    sede: 'https://sede.educacion.gob.es',
    normativa: {
      notas: [
        'Melilla se gestiona por el Ministerio de Educación: no hay decreto autonómico y se aplican directamente los reales decretos estatales.',
        'Los trámites se registran en la sede electrónica del Ministerio (sede.educacion.gob.es).',
      ],
    },
  },
];

export const ccaaPorId = (id: string): Ccaa | undefined => CCAA.find((c) => c.id === id);

export const CUERPOS = [
  'Cuerpo de Maestros (primaria e infantil)',
  'Cuerpo de Profesores de Enseñanza Secundaria',
  'Cuerpo de Profesores Técnicos de FP',
  'Cuerpo de Catedráticos de Enseñanza Secundaria',
  'Cuerpo de Profesores de Música y Artes Escénicas',
  'Cuerpo de Maestros de Taller de Artes Plásticas y Diseño',
  'Personal docente interino',
  'Personal laboral docente',
  'Otro',
];

/* ─── Ayudas para usar la normativa por CCAA ──────────────────────── */

const NOMBRES_ETAPA: Record<string, string> = {
  infantil: 'Educación Infantil',
  primaria: 'Educación Primaria',
  eso: 'Educación Secundaria Obligatoria',
  bachillerato: 'Bachillerato',
  fp: 'Formación Profesional',
};

/** Línea del decreto de currículo de la CCAA para la etapa, o marcador [Completar: …] */
export function decretoCurriculo(ccaa: Ccaa | undefined, etapa: string): string {
  const etapaNombre = NOMBRES_ETAPA[etapa] ?? etapa;
  // Ceuta y Melilla: gestión ministerial, sin decreto autonómico
  if (ccaa && (ccaa.id === 'ceuta' || ccaa.id === 'melilla'))
    return `Se aplican directamente los reales decretos estatales de enseñanzas mínimas (Ceuta y Melilla se gestionan por el Ministerio de Educación).`;
  const c = ccaa?.normativa?.curriculo;
  const linea = etapa === 'primaria' ? c?.primaria : etapa === 'eso' ? c?.eso : c?.bachillerato;
  const elegido = linea ?? (c?.basica && etapa !== 'bachillerato' ? c.basica : undefined);
  if (elegido && ccaa) return `${elegido} (${ccaa.nombre}).`;
  return `[Completar: decreto de currículo de ${ccaa?.nombre ?? 'tu comunidad autónoma'} para ${etapaNombre}]`;
}

/** Marco normativo completo de una programación didáctica, por CCAA y etapa */
export function marcoNormativoCcaa(ccaa: Ccaa | undefined, etapa: string): string[] {
  // FP se ordena por la LO 3/2022 y el RD 659/2023, con RD de título por ciclo
  if (etapa === 'fp') {
    return [
      'Ley Orgánica 3/2022, de 31 de marzo, de ordenación e integración de la Formación Profesional',
      'Real Decreto 659/2023, de 5 de diciembre, por el que se desarrolla la ordenación del Sistema de Formación Profesional',
      '[Completar: Real Decreto del título del ciclo y orden autonómica de currículo aplicables]',
      'Proyecto Educativo de Centro y proyecto curricular del ciclo formativo',
    ];
  }
  const rd =
    etapa === 'primaria'
      ? 'Real Decreto 157/2022, de 1 de marzo, por el que se establecen la ordenación y las enseñanzas mínimas de la Educación Primaria'
      : etapa === 'infantil'
        ? 'Real Decreto 95/2022, de 1 de febrero, por el que se establece la ordenación de las enseñanzas de la educación infantil'
        : 'Real Decreto 217/2022, de 29 de marzo, por el que se establecen la ordenación y las enseñanzas mínimas de la ESO y del Bachillerato';
  const lineas = [
    'Ley Orgánica 3/2020, de 30 de diciembre (LOMLOE), que modifica la LOE 2/2006',
    rd,
  ];
  if (etapa === 'infantil') {
    lineas.push(
      ccaa?.normativa?.curriculo?.infantil
        ? `${ccaa.normativa.curriculo.infantil} (${ccaa.nombre}).`
        : `[Completar: orden o decreto de currículo de Educación Infantil de ${ccaa?.nombre ?? 'tu comunidad autónoma'}]`,
    );
  } else {
    lineas.push(decretoCurriculo(ccaa, etapa));
  }
  lineas.push(ccaa?.normativa?.evaluacion ?? '[Completar: orden de evaluación de la etapa de tu comunidad autónoma]');
  lineas.push('Proyecto Educativo de Centro y Programación General Anual del centro');
  return lineas;
}
