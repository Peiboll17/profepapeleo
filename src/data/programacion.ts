import type { Bloque } from '../lib/doc';
import type { Perfil } from '../store/perfil';
import { cursoActual, fechaLarga } from '../lib/format';
import { ccaaPorId, marcoNormativoCcaa } from './ccaa';

/* ─── Catálogos ───────────────────────────────────────────────────── */

export const ETAPAS = [
  { id: 'infantil', nombre: 'Educación Infantil' },
  { id: 'primaria', nombre: 'Educación Primaria' },
  { id: 'eso', nombre: 'Educación Secundaria Obligatoria' },
  { id: 'bachillerato', nombre: 'Bachillerato' },
  { id: 'fp', nombre: 'Formación Profesional' },
];

export const COMPETENCIAS_CLAVE = [
  'CCL — Competencia en comunicación lingüística',
  'CP — Competencia plurilingüe',
  'STEM — Competencia matemática y competencia en ciencia, tecnología e ingeniería',
  'CD — Competencia digital',
  'CPSAA — Competencia personal, social y de aprender a aprender',
  'CC — Competencia ciudadana',
  'CE — Competencia emprendedora',
  'CCEC — Competencia en conciencia y expresión culturales',
];

export interface SemillaMateria {
  id: string;
  etapa: string;
  nombre: string;
  cursos: string[];
  /** Resumen orientativo de las competencias específicas */
  competencias: string[];
  /** Bloques de saberes básicos (resumen) */
  saberes: { bloque: string; resumen: string }[];
}

/**
 * Semillas orientativas (paráfrasis abreviada de currículo estatal).
 * Antes de entregar, contrasta el texto literal de tu currículo autonómico
 * o usa el generador de IA para desarrollar cada punto.
 */
export const SEMILLAS: SemillaMateria[] = [
  {
    id: 'mat-eso',
    etapa: 'eso',
    nombre: 'Matemáticas',
    cursos: ['1º ESO', '2º ESO', '3º ESO', '4º ESO A', '4º ESO B'],
    competencias: [
      'CE1. Interpretar, modelizar y resolver problemas de la vida cotidiana aplicando distintas estrategias y formas de razonamiento.',
      'CE2. Analizar situaciones y validar las soluciones usando estrategias matemáticas, comprobando su coherencia e idoneidad.',
      'CE3. Utilizar el pensamiento computacional y herramientas digitales para plantear y resolver problemas, comunicando los resultados.',
      'CE4. Utilizar el lenguaje matemático para expresar ideas, razonamientos y resultados con precisión, oralmente y por escrito.',
      'CE5. Gestionar las emociones propias y desarrollar autoconfianza, flexibilidad y perseverancia en la actividad matemática.',
      'CE6. Apreciar el papel de las matemáticas en la sociedad y valorar las aportaciones de distintas culturas a su desarrollo.',
    ],
    saberes: [
      { bloque: 'A. Sentido numérico', resumen: 'contenidos y estructura del sistema numérico; operaciones; potencias, raíces y logaritmos; aproximación y estimación.' },
      { bloque: 'B. Sentido de la medida', resumen: 'medición directa e indirecta; perímetros, áreas y volúmenes; la regla de Laplace y el cálculo de incertidumbre.' },
      { bloque: 'C. Sentido espacial', resumen: 'figuras geométricas y sus propiedades; movimientos y transformaciones; visualización y representación 2D/3D; sistemas de referencia.' },
      { bloque: 'D. Sentido algebraico', resumen: 'patrones; lenguaje algebraico; modelización con ecuaciones, inecuaciones y sistemas; pensamiento computacional.' },
      { bloque: 'E. Sentido estocástico', resumen: 'interpretación y análisis de datos; incertidumbre y azar; elementos de probabilidad; inferencia y comparación de distribuciones.' },
      { bloque: 'F. Sentido socioafectivo', resumen: 'gestión emocional, creatividad y pensamiento crítico; matemáticas como herramienta de análisis social.' },
    ],
  },
  {
    id: 'lengua-eso',
    etapa: 'eso',
    nombre: 'Lengua Castellana y Literatura',
    cursos: ['1º ESO', '2º ESO', '3º ESO', '4º ESO'],
    competencias: [
      'CE1. Describir y apreciar la diversidad lingüística del mundo y el plurilingüismo de España, valorando las variedades del español.',
      'CE2. Comprender e interpretar textos orales y multimodales, reconociendo el sentido global, las ideas principales y la intención comunicativa.',
      'CE3. Producir textos orales y multimodales con fluidez, coherencia y registro adecuado, atendiendo a la interacción comunicativa.',
      'CE4. Comprender, interpretar y valorar textos escritos reconociendo su sentido global y la relación entre forma y contenido.',
      'CE5. Producir textos escritos y multimodales coherentes, cohesionados, gramatical y ortográficamente correctos.',
      'CE6. Seleccionar y leer obras literarias como fuente de conocimiento y disfrute, construyendo la identidad lectora y creando textos de intención literaria.',
    ],
    saberes: [
      { bloque: 'A. Las lenguas y sus hablantes', resumen: 'diversidad lingüística; variedades del español; lenguas de signos; mitos y prejuicios lingüísticos.' },
      { bloque: 'B. Comunicación', resumen: 'estrategias de producción y comprensión oral y escrita; interacción; alfabetización mediática e informacional.' },
      { bloque: 'C. Educación literaria', resumen: 'lectura autónoma; educación literaria; las literaturas de España y la hispanoamericana; géneros y movimientos.' },
      { bloque: 'D. Reflexión sobre la lengua', resumen: 'gramática; léxico y semántica; ortografía; usos discursivos.' },
    ],
  },
  {
    id: 'gyh-eso',
    etapa: 'eso',
    nombre: 'Geografía e Historia',
    cursos: ['1º ESO', '2º ESO', '3º ESO', '4º ESO'],
    competencias: [
      'CE1. Buscar, seleccionar, tratar y comunicar información sobre procesos históricos y geográficos usando fuentes fiables y criterios de relevancia.',
      'CE2. Indagar, argumentar y elaborar productos sobre problemas geográficos, históricos y sociales significativos.',
      'CE3. Analizar los principales desafíos del mundo actual (desigualdad, conflictos, sostenibilidad, retos demográficos) y proponer respuestas.',
      'CE4. Identificar los elementos del entorno, explicar su transformación y valorar la interacción entre las personas y el medio.',
      'CE5. Comprender procesos y fenómenos históricos y su conexión con el presente, usando conceptos y escala temporal.',
      'CE6. Comprender el conocimiento histórico como proceso en construcción, valorando el patrimonio y la memoria democrática.',
    ],
    saberes: [
      { bloque: 'A. Retos del mundo actual', resumen: 'desigualdades; globalización; cambio climático; retos demográficos; diversidad cultural.' },
      { bloque: 'B. Sociedades y territorios', resumen: 'paisajes y medios naturales; urbanismo; sociedades históricas preindustriales, modernas y contemporáneas.' },
      { bloque: 'C. Compromiso cívico', resumen: 'ciudadanía global y local; proyectos cooperativos; patrimonio y memoria colectiva.' },
    ],
  },
  {
    id: 'bg-eso',
    etapa: 'eso',
    nombre: 'Biología y Geología',
    cursos: ['1º ESO', '3º ESO', '4º ESO'],
    competencias: [
      'CE1. Interpretar y transmitir información científica, traduciéndola a un lenguaje comprensible y usando terminología adecuada.',
      'CE2. Identificar y describir los elementos de los sistemas naturales, analizando sus relaciones y su evolución temporal.',
      'CE3. Planificar y desarrollar proyectos de investigación aplicando las destrezas del método científico.',
      'CE4. Analizar las causas y consecuencias del cambio global, valorando el desarrollo sostenible y la protección del medio ambiente.',
      'CE5. Conocer el funcionamiento del cuerpo humano y los hábitos saludables, promoviendo decisiones fundamentadas.',
      'CE6. Comprender el papel de la ciencia y del desarrollo tecnológico en la sociedad, valorándola como proceso en construcción.',
    ],
    saberes: [
      { bloque: 'A. Proyecto científico', resumen: 'hipótesis, metodología científica, experimentación, comunicación de resultados.' },
      { bloque: 'B. Geología', resumen: 'Tierra y su historia; tectónica de placas; minerales, rocas y recursos; riesgos naturales.' },
      { bloque: 'C. Seres vivos y su diversidad', resumen: 'la célula; niveles de organización; principales grupos de seres vivos; ecosistemas.' },
      { bloque: 'D. Ecología y sostenibilidad', resumen: 'impacto de la actividad humana; cambio global; desarrollo sostenible y soluciones.' },
      { bloque: 'E. Cuerpo humano y salud', resumen: 'nutrición; relación; reproducción; hábitos saludables y educación afectivo-sexual.' },
    ],
  },
  {
    id: 'fq-eso',
    etapa: 'eso',
    nombre: 'Física y Química',
    cursos: ['2º ESO', '3º ESO', '4º ESO'],
    competencias: [
      'CE1. Interpretar y transmitir información científica con lenguaje preciso, usando diferentes formatos.',
      'CE2. Identificar y describir fenómenos físicos y químicos, estableciendo relaciones entre las propiedades de la materia.',
      'CE3. Planificar y desarrollar proyectos de investigación con método científico y trabajo cooperativo.',
      'CE4. Analizar la importancia de la física y la química en la sociedad, valorando su papel en la sostenibilidad.',
      'CE5. Resolver problemas aplicando leyes, teorías y modelos científicos con razonamiento lógico-matemático.',
      'CE6. Trabajar con seguridad en el laboratorio, valorando la precisión, la honestidad y la comunicación de resultados.',
    ],
    saberes: [
      { bloque: 'A. Proyecto científico', resumen: 'hipótesis, metodología, herramientas digitales y experimentación.' },
      { bloque: 'B. La materia', resumen: 'estados y cambios de estado; mezclas y sustancias; modelos atómicos; enlace químico.' },
      { bloque: 'C. La interacción', resumen: 'fuerzas y movimiento; energía; ondas: luz y sonido; electricidad y magnetismo.' },
      { bloque: 'D. El cambio', resumen: 'reacciones químicas; velocidad de reacción; química y sostenibilidad.' },
    ],
  },
  {
    id: 'ingles-eso',
    etapa: 'eso',
    nombre: 'Lengua Extranjera: Inglés',
    cursos: ['1º ESO', '2º ESO', '3º ESO', '4º ESO'],
    competencias: [
      'CE1. Comprender e interpretar las ideas principales y los detalles relevantes de textos orales y multimodales en lengua extranjera.',
      'CE2. Producir textos originales orales y multimodales con fluidez y corrección, adecuándose a cada situación comunicativa.',
      'CE3. Interactuar activamente con otras personas con suficiente fluidez y autonomía, en ámbitos conocidos.',
      'CE4. Comprender, interpretar y valorar textos escritos con actitud crítica y reflexiva.',
      'CE5. Producir textos escritos claros y coherentes, revisando el borrador y usando recursos digitales.',
      'CE6. Mediar entre distintas lenguas o variedades, mostrando actitud intercultural y de respeto por la diversidad.',
    ],
    saberes: [
      { bloque: 'A. Comunicación', resumen: 'funciones comunicativas; estrategias de comprensión, producción e interacción; estrategias de mediación.' },
      { bloque: 'B. Plurilingüismo', resumen: 'estrategias para reflexionar y progresa; errores como parte del aprendizaje; transferencias entre lenguas.' },
      { bloque: 'C. Interculturalidad', resumen: 'patrimonio cultural de países angloparlantes; comunicación intercultural; estereotipos y prejuicios.' },
    ],
  },
  {
    id: 'tecnologia-eso',
    etapa: 'eso',
    nombre: 'Tecnología y Digitalización',
    cursos: ['1º ESO', '2º ESO', '3º ESO'],
    competencias: [
      'CE1. Investigar y analizar el impacto de la tecnología y la digitalización en la sociedad, valorando la sostenibilidad.',
      'CE2. Diseñar y construir soluciones tecnológicas creativas que resuelvan problemas, aplicando el proceso de proyecto técnico.',
      'CE3. Programar soluciones digitales mediante el pensamiento computacional y la robótica.',
      'CE4. Utilizar herramientas digitales de forma segura, crítica y responsable.',
    ],
    saberes: [
      { bloque: 'A. Proceso de resolución de problemas', resumen: 'proyecto técnico, prototipado e iteración.' },
      { bloque: 'B. Comunicación y difusión de la información', resumen: 'internet, herramientas ofimáticas y colaborativas.' },
      { bloque: 'C. Digitalización de la sociedad', resumen: 'big data, inteligencia artificial, seguridad digital y ciudadanía.' },
      { bloque: 'D. Abstracción y programación', resumen: 'algorítmica, robótica y sistemas de control.' },
    ],
  },
  {
    id: 'ef-eso',
    etapa: 'eso',
    nombre: 'Educación Física',
    cursos: ['1º ESO', '2º ESO', '3º ESO', '4º ESO'],
    competencias: [
      'CE1. Planificar y practicar actividad física orientada a la mejora de la condición física y la salud.',
      'CE2. Adaptar las destrezas motrices a distintos entornos y contextos de práctica, individual y cooperativo.',
      'CE3. Adoptar actitudes de cooperación, deportividad y respeto en juegos y deportes, rechazando cualquier forma de discriminación.',
      'CE4. Valorar los entornos naturales como espacio de práctica física sostenible y de autocuidado.',
    ],
    saberes: [
      { bloque: 'A. Vida activa y saludable', resumen: 'condición física, hábitos y prevención de lesiones.' },
      { bloque: 'B. Juegos y deportes', resumen: 'habilidades motrices, reglas y deportividad.' },
      { bloque: 'C. Expresión corporal', resumen: 'motricidad creativa, ritmo y danza.' },
      { bloque: 'D. Actividad física en el medio natural', resumen: 'seguridad, sostenibilidad y desarrollo rural.' },
    ],
  },
  {
    id: 'epva-eso',
    etapa: 'eso',
    nombre: 'Educación Plástica, Visual y Audiovisual',
    cursos: ['1º ESO', '2º ESO', '3º ESO', '4º ESO'],
    competencias: [
      'CE1. Analizar y valorar imágenes y producciones audiovisuales con actitud crítica, reconociendo sus usos y significados.',
      'CE2. Expresar ideas y emociones mediante el uso creativo de técnicas gráfico-plásticas y audiovisuales, analógicas y digitales.',
      'CE3. Comunicar mensajes visuales y audiovisuales propios aplicando los elementos del lenguaje visual.',
    ],
    saberes: [
      { bloque: 'A. Patrimonio visual y audiovisual', resumen: 'análisis, apreciación y diversidad cultural.' },
      { bloque: 'B. Expresión artística', resumen: 'dibujo, color, composición, técnicas y materiales.' },
      { bloque: 'C. Comunicación audiovisual', resumen: 'fotografía, vídeo, creación digital y alfabetización mediática.' },
    ],
  },
  {
    id: 'musica-eso',
    etapa: 'eso',
    nombre: 'Música y Artes Escénicas',
    cursos: ['1º ESO', '2º ESO', '3º ESO', '4º ESO'],
    competencias: [
      'CE1. Analizar y valorar producciones musicales y escénicas del patrimonio cultural propio y global.',
      'CE2. Expresar y comunicar emociones e ideas mediante la interpretación y creación musical y escénica.',
      'CE3. Colaborar en proyectos musicales y escénicos colectivos, asumiendo roles y responsabilidades.',
    ],
    saberes: [
      { bloque: 'A. Patrimonio musical y escénico', resumen: 'escucha activa, análisis y contextos históricos y culturales.' },
      { bloque: 'B. Interpretación y creación', resumen: 'voz, instrumentos, danza, teatro y producción digital.' },
      { bloque: 'C. Proyectos colectivos', resumen: 'ensayo, roles, presentación ante público.' },
    ],
  },
  {
    id: 'economia-eso',
    etapa: 'eso',
    nombre: 'Economía y Emprendimiento',
    cursos: ['3º ESO', '4º ESO'],
    competencias: [
      'CE1. Analizar el entorno económico y financiero básico, interpretando información para tomar decisiones responsables.',
      'CE2. Desarrollar proyectos emprendedores de valor social y económico, aplicando la creatividad y la colaboración.',
      'CE3. Valorar el consumo responsable y la sostenibilidad en las decisiones económicas personales y sociales.',
    ],
    saberes: [
      { bloque: 'A. Economía personal y ciudadana', resumen: 'presupuesto, ahorro y consumo responsable.' },
      { bloque: 'B. Economía y negocios', resumen: 'la empresa, el mercado y el presupuesto empresarial básico.' },
      { bloque: 'C. Finanzas', resumen: 'herramientas digitales de gestión y ética financiera.' },
      { bloque: 'D. Emprendimiento', resumen: 'ideas, proyectos y plan de negocio sencillo.' },
    ],
  },
  {
    id: 'mat-bach',
    etapa: 'bachillerato',
    nombre: 'Matemáticas',
    cursos: ['1º Bachillerato', '2º Bachillerato'],
    competencias: [
      'CE1. Modelizar y resolver problemas de las ciencias y de la vida cotidiana con estrategias matemáticas rigurosas.',
      'CE2. Emplear el pensamiento computacional y el análisis de datos para resolver problemas y comunicar resultados.',
      'CE3. Argumentar y demostrar con rigor matemático, oralmente y por escrito.',
      'CE4. Gestionar las emociones propias y desarrollar perseverancia en la actividad matemática.',
    ],
    saberes: [
      { bloque: 'A. Análisis', resumen: 'funciones, límites, continuidad, derivabilidad e integración.' },
      { bloque: 'B. Geometría', resumen: 'vectores y geometría del plano y del espacio.' },
      { bloque: 'C. Probabilidad y estadística', resumen: 'distribuciones e inferencia.' },
      { bloque: 'D. Sentido socioafectivo', resumen: 'emociones, perseverancia e historias de las matemáticas.' },
    ],
  },
  {
    id: 'fq-bach',
    etapa: 'bachillerato',
    nombre: 'Física y Química',
    cursos: ['1º Bachillerato', '2º Bachillerato'],
    competencias: [
      'CE1. Interpretar y transmitir información científica con precisión, usando modelos y lenguaje científico.',
      'CE2. Planificar y desarrollar investigaciones experimentales con método científico y cooperación.',
      'CE3. Resolver problemas aplicando leyes, teorías y modelos de la física y la química.',
      'CE4. Valorar la contribución de la ciencia a la sociedad y a la sostenibilidad, con actitud crítica.',
    ],
    saberes: [
      { bloque: 'A. La materia', resumen: 'modelos atómicos, enlace y química orgánica.' },
      { bloque: 'B. La interacción', resumen: 'fuerzas, campo gravitatorio y electromagnetismo.' },
      { bloque: 'C. El movimiento', resumen: 'cinemática, dinámica y energía.' },
      { bloque: 'D. La reacción química', resumen: 'estequiometría, equilibrio y energía de reacción.' },
    ],
  },
  {
    id: 'bgyca-bach',
    etapa: 'bachillerato',
    nombre: 'Biología, Geología y Ciencias Ambientales',
    cursos: ['1º Bachillerato', '2º Bachillerato'],
    competencias: [
      'CE1. Interpretar información científica sobre los sistemas biológicos y geológicos, comunicándola con rigor.',
      'CE2. Planificar investigaciones sobre los sistemas naturales y su dinámica, aplicando el método científico.',
      'CE3. Analizar el impacto humano en los sistemas ambientales y valorar soluciones de sostenibilidad.',
      'CE4. Comprender los mecanismos de la vida: célula, genética, evolución y fisiología.',
    ],
    saberes: [
      { bloque: 'A. Biología celular y molecular', resumen: 'célula, genética y biotecnología.' },
      { bloque: 'B. Fisiología e inmunidad', resumen: 'cuerpo humano, defensas y salud.' },
      { bloque: 'C. Geología', resumen: 'tectónica, riesgos naturales e historia de la Tierra.' },
      { bloque: 'D. Ciencias ambientales', resumen: 'sistemas, recursos, cambio global y sostenibilidad.' },
    ],
  },
  {
    id: 'lengua-bach',
    etapa: 'bachillerato',
    nombre: 'Lengua Castellana y Literatura',
    cursos: ['1º Bachillerato', '2º Bachillerato'],
    competencias: [
      'CE1. Comprender e interpretar textos orales y multimodales con actitud crítica.',
      'CE2. Producir textos escritos y multimodales con coherencia, cohesión y corrección, en registros diversos.',
      'CE3. Leer e interpretar obras literarias del patrimonio español e hispanoamericano, construyendo identidad lectora.',
      'CE4. Reflexionar sobre el funcionamiento de la lengua y su diversidad.',
    ],
    saberes: [
      { bloque: 'A. Comunicación oral y escrita', resumen: 'estrategias, géneros discursivos y alfabetización informacional.' },
      { bloque: 'B. Educación literaria', resumen: 'de la literatura medieval a la actual, con la hispanoamericana.' },
      { bloque: 'C. Reflexión sobre la lengua', resumen: 'gramática, léxico, variación y contacto entre lenguas.' },
    ],
  },
  {
    id: 'hist-espana-bach',
    etapa: 'bachillerato',
    nombre: 'Historia de España',
    cursos: ['2º Bachillerato'],
    competencias: [
      'CE1. Analizar los procesos históricos de España desde la Edad Moderna hasta la actualidad, usando fuentes fiables.',
      'CE2. Comprender y valorar la memoria democrática y la construcción del Estado constitucional.',
      'CE3. Indagar y elaborar productos históricos que conecten pasado y presente con rigor.',
    ],
    saberes: [
      { bloque: 'A. La monarquía hispánica y el Estado moderno', resumen: 'los Austrias y los Borbones.' },
      { bloque: 'B. El siglo XIX', resumen: 'liberalismo, revoluciones y Restauración.' },
      { bloque: 'C. El siglo XX', resumen: 'Guerra Civil, dictadura y transición.' },
      { bloque: 'D. La España actual', resumen: 'autonomías, integración europea y memoria democrática.' },
    ],
  },
  {
    id: 'filosofia-bach',
    etapa: 'bachillerato',
    nombre: 'Filosofía',
    cursos: ['1º Bachillerato'],
    competencias: [
      'CE1. Interpretar y analizar problemas filosóficos de la experiencia humana, evaluando argumentos con rigor.',
      'CE2. Construir argumentos propios y comunicarlos con coherencia y respeto crítico.',
      'CE3. Valorar la filosofía como forma de conocimiento y su influencia en la sociedad actual.',
    ],
    saberes: [
      { bloque: 'A. Filosofía y realidad', resumen: 'teorías del conocimiento y metafísica.' },
      { bloque: 'B. Filosofía y ser humano', resumen: 'antropología, ética y política.' },
      { bloque: 'C. Filosofía y ciencia', resumen: 'método científico y pensamiento filosófico.' },
      { bloque: 'D. Historia de la filosofía', resumen: 'autores y corrientes significativos.' },
    ],
  },
  {
    id: 'mat-pri',
    etapa: 'primaria',
    nombre: 'Matemáticas',
    cursos: ['1º', '2º', '3º', '4º', '5º', '6º'],
    competencias: [
      'CE1. Interpretar situaciones y resolver problemas de la vida cotidiana usando estrategias matemáticas y el pensamiento computacional.',
      'CE2. Razonar de forma matemática, argumentando y comprobando la validez de las soluciones.',
      'CE3. Establecer conexiones entre las matemáticas y otras áreas, valorando su presencia en la vida diaria.',
      'CE4. Comunicar ideas matemáticas usando lenguaje matemático oral, escrito y gráfico.',
      'CE5. Representar ideas y situaciones matemáticas con objetos, dibujos, esquemas y recursos digitales.',
      'CE6. Desarrollar la autoconfianza y el compromiso con las matemáticas como herramienta para analizar el mundo.',
    ],
    saberes: [
      { bloque: 'A. Sentido numérico', resumen: 'conteo, numeración, operaciones y cálculo (mental y algorítmico), estimación.' },
      { bloque: 'B. Sentido de la medida', resumen: 'medición y comparación de atributos: longitud, masa, capacidad, tiempo, dinero, ángulos.' },
      { bloque: 'C. Sentido espacial', resumen: 'figuras, posiciones, orientación y cambio de posición en el espacio.' },
      { bloque: 'D. Sentido algebraico', resumen: 'patrones y regularidades; igualdad y desigualdad; pensamiento computacional.' },
      { bloque: 'E. Sentido estocástico', resumen: 'recogida, organización y representación de datos; azar y probabilidad.' },
      { bloque: 'F. Sentido socioafectivo', resumen: 'emociones, creatividad, esfuerzo y valoración de las matemáticas.' },
    ],
  },
  {
    id: 'lengua-pri',
    etapa: 'primaria',
    nombre: 'Lengua Castellana y Literatura',
    cursos: ['1º', '2º', '3º', '4º', '5º', '6º'],
    competencias: [
      'CE1. Reconocer la diversidad de lenguas de España y del mundo, valorando las variedades del español.',
      'CE2. Comprender e interpretar textos orales y multimodales, identificando el sentido general y las ideas principales.',
      'CE3. Producir textos orales con fluidez y corrección, adaptándose a la situación comunicativa.',
      'CE4. Comprender, interpretar y valorar textos escritos y multimodales, desarrollando el gusto por la lectura.',
      'CE5. Producir textos escritos y multimodales coherentes, cohesionados y correctos.',
      'CE6. Apropiarse del patrimonio literario como fuente de disfrute y crear textos de intención literaria.',
    ],
    saberes: [
      { bloque: 'A. Las lenguas y sus hablantes', resumen: 'diversidad lingüística; variedades del español; respeto por todas las lenguas.' },
      { bloque: 'B. Comunicación', resumen: 'comprensión y producción oral; alfabetización mediática e informacional; estrategias de escritura.' },
      { bloque: 'C. Educación literaria', resumen: 'lectura acompañada y autónoma; géneros narrativos, poéticos y teatrales.' },
      { bloque: 'D. Reflexión sobre la lengua', resumen: 'gramática básica; ortografía; léxico y semántica.' },
    ],
  },
  {
    id: 'medio-pri',
    etapa: 'primaria',
    nombre: 'Conocimiento del Medio Natural, Social y Cultural',
    cursos: ['1º', '2º', '3º', '4º', '5º', '6º'],
    competencias: [
      'CE1. Plantear preguntas y obtener información de distintas fuentes, elaborando productos que comuniquen resultados.',
      'CE2. Aplicar destrezas y actitudes científicas en indagaciones sobre el medio natural y social.',
      'CE3. Resolver problemas y dar respuesta a cuestiones sobre los elementos y fenómenos del medio natural.',
      'CE4. Analizar el medio social y cultural, sus cambios y la interacción de las personas con el entorno.',
      'CE5. Promover hábitos de vida saludable, seguridad y consumo responsable, analizando el propio entorno.',
      'CE6. Participar en proyectos que mejoren el entorno y valorar la diversidad cultural, la equidad y la sostenibilidad.',
    ],
    saberes: [
      { bloque: 'A. Cultura científica', resumen: 'método científico; materia; seres vivos; salud y hábitos; tecnología.' },
      { bloque: 'B. Tecnología y digitalización', resumen: 'dispositivos digitales; robótica; ciudadanía digital crítica.' },
      { bloque: 'C. Sociedades y territorios', resumen: 'comunidad local; paisajes; población; organizaciones sociales; patrimonio; ciudadanía y democracia.' },
    ],
  },
  {
    id: 'ef-pri',
    etapa: 'primaria',
    nombre: 'Educación Física',
    cursos: ['1º', '2º', '3º', '4º', '5º', '6º'],
    competencias: [
      'CE1. Desarrollar habilidades motrices en distintos contextos y actividades físicas.',
      'CE2. Practicar juegos y actividades cooperativas con deportividad, igualdad e inclusión.',
      'CE3. Adoptar hábitos de vida activa y saludable, valorando el autocuidado.',
      'CE4. Disfrutar del medio natural mediante actividades físicas respetuosas con el entorno.',
    ],
    saberes: [
      { bloque: 'A. Vida activa y saludable', resumen: 'hábitos, condición física orientada a la salud.' },
      { bloque: 'B. Juegos y actividades cooperativas', resumen: 'habilidades motrices, reglas e inclusión.' },
      { bloque: 'C. Expresión corporal', resumen: 'juego dramático, ritmo y expresión creativa.' },
      { bloque: 'D. Actividad física en el entorno natural', resumen: 'salidas, seguridad y sostenibilidad.' },
    ],
  },
  {
    id: 'artistica-pri',
    etapa: 'primaria',
    nombre: 'Educación Artística',
    cursos: ['1º', '2º', '3º', '4º', '5º', '6º'],
    competencias: [
      'CE1. Expresar y comunicar ideas y emociones mediante las artes visuales, plásticas, musicales y escénicas.',
      'CE2. Valorar el patrimonio cultural propio y de otras culturas con actitud abierta e interesada.',
      'CE3. Crear producciones artísticas individuales y colectivas con técnicas diversas.',
    ],
    saberes: [
      { bloque: 'A. Artes visuales y plásticas', resumen: 'técnicas, color, composición y creación digital.' },
      { bloque: 'B. Música', resumen: 'escucha, canto, danza e instrumentos.' },
      { bloque: 'C. Artes escénicas', resumen: 'expresión corporal y dramatización.' },
      { bloque: 'D. Cultura artística', resumen: 'patrimonio, artistas y diversidad cultural.' },
    ],
  },
  {
    id: 'ingles-pri',
    etapa: 'primaria',
    nombre: 'Lengua Extranjera: Inglés',
    cursos: ['1º', '2º', '3º', '4º', '5º', '6º'],
    competencias: [
      'CE1. Comprender mensajes sencillos en inglés en situaciones comunicativas cotidianas.',
      'CE2. Producir textos orales y escritos breves con fluidez incipiente.',
      'CE3. Interactuar e intermediar en intercambios sencillos mostrando respeto por la diversidad.',
    ],
    saberes: [
      { bloque: 'A. Comunicación', resumen: 'comprensión y producción oral y escrita.' },
      { bloque: 'B. Plurilingüismo', resumen: 'estrategias de aprendizaje y transferencias entre lenguas.' },
      { bloque: 'C. Interculturalidad', resumen: 'culturas angloparlantes y diversidad.' },
    ],
  },
  {
    id: 'valores-pri',
    etapa: 'primaria',
    nombre: 'Educación en Valores Cívicos y Éticos',
    cursos: ['5º', '6º'],
    competencias: [
      'CE1. Analizar y valorar las normas de convivencia y los derechos humanos, actuando con responsabilidad.',
      'CE2. Identificar y rechazar situaciones de discriminación, desigualdad o violencia, promoviendo la igualdad.',
      'CE3. Participar en el cuidado del entorno y de la vida democrática del centro y de la comunidad.',
    ],
    saberes: [
      { bloque: 'A. Convivencia y valores', resumen: 'normas, derechos humanos e igualdad.' },
      { bloque: 'B. Diversidad social y cultural', resumen: 'respeto, cooperación e inclusión.' },
      { bloque: 'C. Ciudadanía activa', resumen: 'participación, sostenibilidad y consumo responsable.' },
    ],
  },
  {
    id: 'inf-armonia',
    etapa: 'infantil',
    nombre: 'Área 1: Crecimiento en Armonía',
    cursos: ['3 años', '4 años', '5 años'],
    competencias: [
      'CE1. Progresar en el conocimiento y regulación de las emociones y necesidades propias, desarrollando hábitos saludables de autocuidado y bienestar.',
      'CE2. Descubrir y aceptar el propio cuerpo, avanzando en la autonomía personal y en las habilidades motrices básicas.',
      'CE3. Participar progresivamente en la vida del aula y del centro, estableciendo relaciones afectivas positivas y respetuosas con iguales y adultos.',
    ],
    saberes: [
      { bloque: 'A. El cuerpo y la imagen personal', resumen: 'identidad personal, percepción y representación del cuerpo, hábitos de higiene, alimentación y salud.' },
      { bloque: 'B. Autonomía personal', resumen: 'iniciativa, autoconfianza y habilidades para la vida cotidiana.' },
      { bloque: 'C. Vida en sociedad', resumen: 'convivencia, afectos, normas y hábitos de relación con iguales y adultos.' },
    ],
  },
  {
    id: 'inf-comunicacion',
    etapa: 'infantil',
    nombre: 'Área 2: Comunicación y Representación de la Realidad',
    cursos: ['3 años', '4 años', '5 años'],
    competencias: [
      'CE1. Expresarse y comunicarse mediante lenguajes verbales y no verbales, progresando en la comprensión y expresión oral y en el interés por la cultura escrita.',
      'CE2. Expresar y representar ideas y emociones mediante los lenguajes plástico, musical, corporal y digital, con creatividad.',
    ],
    saberes: [
      { bloque: 'A. Lenguaje verbal', resumen: 'comprensión y expresión oral, aproximación a la lectoescritura.' },
      { bloque: 'B. Lenguajes artísticos', resumen: 'expresión plástica, musical y corporal.' },
      { bloque: 'C. Lenguajes digitales y audiovisuales', resumen: 'iniciación al uso creativo y seguro de las tecnologías.' },
    ],
  },
  {
    id: 'inf-entorno',
    etapa: 'infantil',
    nombre: 'Área 3: Descubrimiento y Exploración del Entorno Inmediato',
    cursos: ['3 años', '4 años', '5 años'],
    competencias: [
      'CE1. Observar, explorar e interactuar con el medio físico y natural, actuando de forma respetuosa y sostenible.',
      'CE2. Iniciar el pensamiento matemático mediante la manipulación de objetos y la resolución de situaciones de la vida cotidiana.',
      'CE3. Descubrir el entorno social más cercano (familia, comunidad, culturas diversas), valorándolo con respeto y curiosidad.',
    ],
    saberes: [
      { bloque: 'A. Medio físico y natural', resumen: 'elementos del entorno, seres vivos y cuidado del medio.' },
      { bloque: 'B. Pensamiento matemático', resumen: 'cantidad, número, espacios, formas y medidas.' },
      { bloque: 'C. Entorno social', resumen: 'vida familiar y comunitaria, diversidad cultural.' },
    ],
  },
  {
    id: 'fol-fp',
    etapa: 'fp',
    nombre: 'Formación y Orientación Laboral (FOL)',
    cursos: ['2º [cualquier ciclo]'],
    competencias: [
      'CE1. Analizar el marco del derecho del trabajo y los derechos y obligaciones derivados de la relación laboral.',
      'CE2. Valorar y planificar el itinerario profesional y las oportunidades de empleo y formación del sector.',
      'CE3. Actuar con seguridad y salud en el trabajo, aplicando la normativa de prevención de riesgos.',
    ],
    saberes: [
      { bloque: 'A. Derecho del trabajo', resumen: 'contratos, convenios colectivos y seguridad social.' },
      { bloque: 'B. Búsqueda de empleo', resumen: 'itinerario profesional, autoempleo y técnicas de inserción.' },
      { bloque: 'C. Seguridad y salud laboral', resumen: 'riesgos, prevención y primeros auxilios.' },
    ],
  },
  {
    id: 'lenguajes-marcas-fp',
    etapa: 'fp',
    nombre: 'Lenguajes de Marcas y Sistemas de Gestión de Información',
    cursos: ['1º [SMR/DAM/DAW/ASIR]'],
    competencias: [
      'CE1. Reconocer los elementos de redes y su interconexión, describiendo los protocolos de comunicación.',
      'CE2. Utilizar lenguajes de marcas para la elaboración y distribución de documentos y contenidos web estructurados.',
      'CE3. Preparar sistemas para el acceso a datos, instalando y configurando bases de datos y herramientas de gestión.',
    ],
    saberes: [
      { bloque: 'A. Sistemas informáticos', resumen: 'arquitectura, sistemas operativos y virtualización.' },
      { bloque: 'B. Redes locales', resumen: 'topologías, protocolos TCP/IP y servicios.' },
      { bloque: 'C. Lenguajes de marcas', resumen: 'XML, HTML, CSS y validación.' },
      { bloque: 'D. Bases de datos', resumen: 'instalación, SQL básico e integridad.' },
    ],
  },
];

export const semillasPorEtapa = (etapa: string): SemillaMateria[] => SEMILLAS.filter((s) => s.etapa === etapa);
export const semillaPorId = (id: string): SemillaMateria | undefined => SEMILLAS.find((s) => s.id === id);

/* ─── Textos prefijados paramétricos ──────────────────────────────── */

export interface DatosProgramacion {
  etapa: string;
  materia: string;
  semillaId: string;
  curso: string;
  numeroUnidades: number;
  horasSemanales: string;
  marcoNormativo: string;
  introduccion: string;
  competenciasTexto: string;
  saberesTexto: string;
  metodologia: string;
  atencionDiversidad: string;
  evaluacion: string;
  calificacion: string;
  unidadesTexto: string;
  transversales: string;
  extraescolares: string;
  /** Fuente citada de las competencias específicas (solo si el texto es literal del currículo estatal) */
  fuenteCE: string;
}

export interface CtxProgramacion {
  perfil: Perfil;
}

/** Introducción genérica paramétrica, compartida por el estado inicial y los cambios de etapa */
export function textoIntroduccion(materia: string, curso: string): string {
  return `La presente programación didáctica de ${materia} para ${curso} se elabora conforme a la normativa vigente y al Proyecto Educativo del centro, con la finalidad de planificar el proceso de enseñanza-aprendizaje durante el curso escolar ${cursoActual()}.\n\n[Amplía aquí: características del grupo, línea metodológica del departamento y finalidad de la materia en la etapa.]`;
}

export function defectosProgramacion(ctx: CtxProgramacion): DatosProgramacion {
  const { perfil } = ctx;
  const s = semillaPorId('mat-eso')!;
  const etapa = 'eso';
  const ccaa = ccaaPorId(perfil.ccaa);
  const curso = '1º ESO';
  return {
    etapa,
    materia: s.nombre,
    semillaId: s.id,
    curso,
    numeroUnidades: 12,
    horasSemanales: '4',
    marcoNormativo: marcoNormativoCcaa(ccaa, etapa)
      .map((l) => `− ${l}`)
      .join('\n'),
    introduccion: textoIntroduccion(s.nombre, curso),
    competenciasTexto: s.competencias.join('\n'),
    saberesTexto: s.saberes.map((b) => `${b.bloque}: ${b.resumen}`).join('\n'),
    metodologia: `El enfoque será competencial y se concretará en situaciones de aprendizaje que partan de contextos cercanos al alumnado. Se combinarán:\n− Exposición dialogada y trabajo guiado.\n− Trabajo individual, por parejas y cooperativo en grupos heterogéneos.\n− Aprendizaje basado en tareas y proyectos, con productos finales evaluables.\n− Integración de herramientas digitales y recursos manipulativos.\n− Atención a la lectura: dedicación de tiempo lectivo a la comprensión lectora en la materia.\n\n[Adapta: programas del centro (bilingüe, TIC, STEAM…).]`,
    atencionDiversidad: `Se aplicará el Diseño Universal para el Aprendizaje (DUA) y las medidas ordinarias: refuerzo y apoyo dentro del aula, flexibilidad metodológica y organizativa, variedad de materiales y tiempos, y agrupamientos heterogéneos.\n\nPara el alumnado que lo requiera, se propondrán medidas específicas (adaptaciones curriculares significativas, apoyos del profesorado de PT/AL) en coordinación con el departamento de orientación, y medidas de ampliación para el alumnado con altas capacidades.\n\n[Adapta: programas de refuerzo del centro, alumnado con NEE/TEL/DIAS del grupo.]`,
    evaluacion: `La evaluación será continua, formativa, integradora y objetiva, tomando como referentes los criterios de evaluación de la materia a través de las competencias específicas.\n\nInstrumentos: observación del trabajo en el aula, cuaderno del alumnado, pruebas escritas y orales, productos de situaciones de aprendizaje, rúbricas y autoevaluación/coevaluación.\n\nRecuperación: el alumnado con la materia pendiente seguirá un plan de refuerzo con actividades y pruebas parciales; quien no supere la evaluación ordinaria dispondrá de un plan específico para la convocatoria extraordinaria.`,
    calificacion: `La calificación de cada evaluación se obtendrá de la media ponderada de las calificaciones de los criterios de evaluación trabajados, con los siguientes pesos orientativos:\n− Pruebas específicas (escritas/orales): 50 %\n− Productos de situaciones de aprendizaje (trabajos, proyectos): 30 %\n− Observación del trabajo diario y el cuaderno: 20 %\n\n[Adapta los pesos a los acuerdos de tu departamento.]`,
    unidadesTexto: Array.from({ length: 12 }, (_, i) => `Unidad ${i + 1}. [Título] | 12 sesiones`).join('\n'),
    transversales: `Se trabajarán de forma transversal la comprensión lectora, la expresión oral y escrita, la educación en valores (igualdad, convivencia y respeto), la educación emocional, la cultura emprendedora, la educación para la salud y el consumo responsable, y la competencia digital, en consonancia con los planes del centro.`,
    extraescolares: `[Enumera las actividades complementarias y extraescolares previstas: salidas, concursos, talleres, charlas…, con fechas aproximadas y relación con las unidades didácticas.]`,
    fuenteCE: '',
  };
}

/* ─── Construcción del documento ──────────────────────────────────── */

const li = (texto: string): string[] =>
  texto
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[-−•]\s*/, ''));

export function construirProgramacion(
  d: DatosProgramacion,
  ctx: CtxProgramacion,
): { titulo: string; bloques: Bloque[] } {
  const { perfil } = ctx;
  const ccaa = ccaaPorId(perfil.ccaa);
  const etapa = ETAPAS.find((e) => e.id === d.etapa)?.nombre ?? d.etapa;
  const titulo = `Programación didáctica de ${d.materia} — ${d.curso}`;

  const portada: Bloque[] = [
    { t: 'p', texto: perfil.centro || '[Centro]', clase: 'center' },
    { t: 'p', texto: `${perfil.localidad ? `${perfil.localidad} · ` : ''}Curso ${cursoActual()}`, clase: 'center' },
    { t: 'h1', texto: `PROGRAMACIÓN DIDÁCTICA` },
    { t: 'p', texto: `${d.materia} · ${d.curso}`, clase: 'center' },
    { t: 'p', texto: `${etapa}`, clase: 'center' },
    { t: 'p', texto: `Departamento: [Departamento didáctico]` },
    { t: 'p', texto: `Docente: ${[perfil.nombre, perfil.apellidos].filter(Boolean).join(' ') || '[Docente]'}` },
    { t: 'p', texto: `Horas semanales: ${d.horasSemanales || '[—]'}` },
    { t: 'salto' },
  ];

  const seccion = (num: number, tituloSeccion: string, bloquesSeccion: Bloque[]): Bloque[] => [
    { t: 'h2', texto: `${num}. ${tituloSeccion}` },
    ...bloquesSeccion,
  ];

  const unidades = li(d.unidadesTexto).map((u) => {
    const [tituloU, resto] = u.split('|');
    return [tituloU.trim(), (resto ?? '').trim()];
  });

  return {
    titulo,
    bloques: [
      ...portada,
      ...seccion(1, 'Introducción y justificación', li(d.introduccion).map((p) => ({ t: 'p', texto: p }) as Bloque)),
      ...seccion(2, 'Marco normativo', [{ t: 'ul', items: li(d.marcoNormativo) }]),
      ...seccion(3, 'Contextualización', [
        { t: 'p', texto: `Centro: ${perfil.centro || '[Centro]'} — ${perfil.localidad || '[Localidad]'}${ccaa ? ` (${ccaa.nombre})` : ''}.` },
        { t: 'p', texto: `[Describe brevemente el contexto sociolingüístico del centro y las características del grupo-clase.]` },
      ]),
      ...seccion(4, 'Competencias clave y perfil de salida', [
        { t: 'p', texto: 'La materia contribuye al desarrollo de las ocho competencias clave del currículo:' },
        { t: 'ul', items: COMPETENCIAS_CLAVE },
      ]),
      ...seccion(
        5,
        d.etapa === 'fp' ? 'Resultados de aprendizaje y criterios de evaluación' : 'Competencias específicas y criterios de evaluación',
        [
          {
            t: 'p',
            texto: d.fuenteCE
              ? 'Competencias específicas de la materia:'
              : d.etapa === 'fp'
                ? 'Resultados de aprendizaje del módulo (resumen orientativo; contrasta con el Real Decreto del título):'
                : 'Competencias específicas de la materia (resumen orientativo; contrasta con el currículo autonómico):',
          },
          { t: 'ol', items: li(d.competenciasTexto).map((l) => l.replace(/^CE\d+\.\s*/, '')) },
          ...(d.fuenteCE
            ? ([
                {
                  t: 'p',
                  texto: `Texto de las competencias específicas conforme a ${d.fuenteCE}. Verifica el decreto de tu comunidad autónoma, que puede introducir adaptaciones.`,
                  clase: 'muted',
                },
              ] as Bloque[])
            : []),
        ],
      ),
      ...seccion(6, d.etapa === 'fp' ? 'Contenidos del módulo' : 'Saberes básicos', [
        {
          t: 'p',
          texto: d.etapa === 'fp' ? 'Contenidos organizados por bloques (resumen orientativo):' : 'Saberes básicos organizados por bloques (resumen orientativo):',
        },
        { t: 'ul', items: li(d.saberesTexto) },
      ]),
      ...seccion(7, 'Metodología', [{ t: 'ul', items: li(d.metodologia) }]),
      ...seccion(8, 'Atención a la diversidad y a las diferencias individuales', [
        ...li(d.atencionDiversidad).map((p) => ({ t: 'p', texto: p }) as Bloque),
      ]),
      ...seccion(9, 'Evaluación', [...li(d.evaluacion).map((p) => ({ t: 'p', texto: p }) as Bloque)]),
      ...seccion(10, 'Criterios de calificación', [
        ...li(d.calificacion).map((p) => ({ t: 'p', texto: p }) as Bloque),
      ]),
      ...seccion(11, 'Secuencia temporal de unidades didácticas', [
        { t: 'tabla', encabezado: true, filas: [['Unidad didáctica', 'Sesiones / temporalización'], ...unidades] },
      ]),
      ...seccion(12, 'Educación en valores y elementos transversales', [
        ...li(d.transversales).map((p) => ({ t: 'p', texto: p }) as Bloque),
      ]),
      ...seccion(13, 'Actividades complementarias y extraescolares', [
        ...li(d.extraescolares).map((p) => ({ t: 'p', texto: p }) as Bloque),
      ]),
      { t: 'p', texto: `En ${perfil.localidad || '[Localidad]'}, ${fechaLarga(new Date().toISOString().slice(0, 10))}`, clase: 'right' },
      { t: 'firma', nombre: [perfil.nombre, perfil.apellidos].filter(Boolean).join(' ') || undefined, cargo: 'Docente de la materia' },
    ],
  };
}
