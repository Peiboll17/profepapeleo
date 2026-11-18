/**
 * Currículo literal: texto oficial de las competencias específicas por materia.
 * Fuente: currículo estatal (enseñanzas mínimas) — RD 217/2022, anexo II (ESO).
 * Las CCAA copian casi literalmente estas competencias en sus decretos, pero
 * pueden introducir adaptaciones: el asistente lo recuerda al docente.
 */

export interface CurriculoLiteral {
  /** Cita exacta de la fuente del texto */
  fuente: string;
  /** Competencias específicas, texto literal */
  competencias: string[];
}

export const CURRICULO_LITERAL: Record<string, CurriculoLiteral> = {
  'mat-eso': {
    fuente: 'RD 217/2022, de 29 de marzo, anexo II (currículo estatal de la ESO)',
    competencias: [
      'Interpretar, modelizar y resolver problemas de la vida cotidiana y propios de las matemáticas, aplicando diferentes estrategias y formas de razonamiento, para explorar distintas maneras de proceder y obtener posibles soluciones.',
      'Analizar las soluciones de un problema usando diferentes técnicas y herramientas, evaluando las respuestas obtenidas, para verificar su validez e idoneidad desde un punto de vista matemático y su repercusión global.',
      'Formular y comprobar conjeturas sencillas o plantear problemas de forma autónoma, reconociendo el valor del razonamiento y la argumentación, para generar nuevo conocimiento.',
      'Utilizar los principios del pensamiento computacional organizando datos, descomponiendo en partes, reconociendo patrones, interpretando, modificando y creando algoritmos, para modelizar situaciones y resolver problemas de forma eficaz.',
      'Reconocer y utilizar conexiones entre los diferentes elementos matemáticos, interconectando conceptos y procedimientos, para desarrollar una visión de las matemáticas como un todo integrado.',
      'Identificar las matemáticas implicadas en otras materias y en situaciones reales susceptibles de ser abordadas en términos matemáticos, interrelacionando conceptos y procedimientos, para aplicarlos en situaciones diversas.',
      'Representar, de forma individual y colectiva, conceptos, procedimientos, información y resultados matemáticos, usando diferentes tecnologías, para visualizar ideas y estructurar procesos matemáticos.',
      'Comunicar de forma individual y colectiva conceptos, procedimientos y argumentos matemáticos, usando lenguaje oral, escrito o gráfico, utilizando la terminología matemática apropiada, para dar significado y coherencia a las ideas matemáticas.',
      'Desarrollar destrezas personales, identificando y gestionando emociones, poniendo en práctica estrategias de aceptación del error como parte del proceso de aprendizaje y adaptándose ante situaciones de incertidumbre, para mejorar la perseverancia en la consecución de objetivos y el disfrute en el aprendizaje de las matemáticas.',
      'Desarrollar destrezas sociales reconociendo y respetando las emociones y experiencias de los demás, participando activa y reflexivamente en proyectos en equipos heterogéneos con roles asignados, para construir una identidad positiva como estudiante de matemáticas, fomentar el bienestar personal y grupal y crear relaciones saludables.',
    ],
  },
  'lengua-eso': {
    fuente: 'RD 217/2022, de 29 de marzo, anexo II (currículo estatal de la ESO)',
    competencias: [
      'Describir y apreciar la diversidad lingüística del mundo a partir del reconocimiento de las lenguas del alumnado y la realidad plurilingüe y pluricultural de España, analizando el origen y desarrollo sociohistórico de sus lenguas y las características de las principales variedades dialectales del español, para favorecer la reflexión interlingüística, para combatir los estereotipos y prejuicios lingüísticos y para valorar dicha diversidad como fuente de riqueza cultural.',
      'Comprender e interpretar textos orales y multimodales, recogiendo el sentido general y la información más relevante, identificando el punto de vista y la intención del emisor y valorando su fiabilidad, su forma y su contenido, para construir conocimiento, para formarse opinión y para ensanchar las posibilidades de disfrute y ocio.',
      'Producir textos orales y multimodales con fluidez, coherencia, cohesión y registro adecuado, atendiendo a las convenciones propias de los diferentes géneros discursivos, y participar en interacciones orales con actitud cooperativa y respetuosa, tanto para construir conocimiento y establecer vínculos personales como para intervenir de manera activa e informada en diferentes contextos sociales.',
      'Comprender, interpretar y valorar textos escritos, con sentido crítico y diferentes propósitos de lectura, reconociendo el sentido global y las ideas principales y secundarias, identificando la intención del emisor, reflexionando sobre el contenido y la forma y evaluando su calidad y fiabilidad, para dar respuesta a necesidades e intereses comunicativos diversos y para construir conocimiento.',
      'Producir textos escritos y multimodales coherentes, cohesionados, adecuados y correctos, atendiendo a las convenciones propias del género discursivo elegido, para construir conocimiento y para dar respuesta de manera informada, eficaz y creativa a demandas comunicativas concretas.',
      'Seleccionar y contrastar información procedente de diferentes fuentes de manera progresivamente autónoma, evaluando su fiabilidad y pertinencia en función de los objetivos de lectura y evitando los riesgos de manipulación y desinformación, e integrarla y transformarla en conocimiento, para comunicarla desde un punto de vista crítico y personal a la par que respetuoso con la propiedad intelectual.',
      'Seleccionar y leer de manera progresivamente autónoma obras diversas como fuente de placer y conocimiento, configurando un itinerario lector que evolucione en cuanto a diversidad, complejidad y calidad de las obras, y compartir experiencias de lectura, para construir la propia identidad lectora y para disfrutar de la dimensión social de la lectura.',
      'Leer, interpretar y valorar obras o fragmentos literarios del patrimonio nacional y universal, utilizando un metalenguaje específico y movilizando la experiencia biográfica y los conocimientos literarios y culturales que permiten establecer vínculos entre textos diversos y con otras manifestaciones artísticas, para conformar un mapa cultural, para ensanchar las posibilidades de disfrute de la literatura y para crear textos de intención literaria.',
      'Movilizar el conocimiento sobre la estructura de la lengua y sus usos y reflexionar de manera progresivamente autónoma sobre las elecciones lingüísticas y discursivas, con la terminología adecuada, para desarrollar la conciencia lingüística, para aumentar el repertorio comunicativo y para mejorar las destrezas tanto de producción oral y escrita como de comprensión e interpretación crítica.',
      'Poner las propias prácticas comunicativas al servicio de la convivencia democrática, la resolución dialogada de los conflictos y la igualdad de derechos de todas las personas, utilizando un lenguaje no discriminatorio y desterrando los abusos de poder a través de la palabra, para favorecer un uso no solo eficaz sino también ético y democrático del lenguaje.',
    ],
  },
  'gyh-eso': {
    fuente: 'RD 217/2022, de 29 de marzo, anexo II (currículo estatal de la ESO)',
    competencias: [
      'Buscar, seleccionar, tratar y organizar información sobre temas relevantes del presente y del pasado, usando críticamente fuentes históricas y geográficas, para adquirir conocimientos, elaborar y expresar contenidos en varios formatos.',
      'Indagar, argumentar y elaborar productos propios sobre problemas geográficos, históricos y sociales que resulten relevantes en la actualidad, desde lo local a lo global, para desarrollar un pensamiento crítico, respetuoso con las diferencias, que contribuya a la construcción de la propia identidad y a enriquecer el acervo común.',
      'Conocer los principales desafíos a los que se han enfrentado distintas sociedades a lo largo del tiempo, identificando las causas y consecuencias de los cambios producidos y los problemas a los que se enfrentan en la actualidad, mediante el desarrollo de proyectos de investigación y el uso de fuentes fiables, para realizar propuestas que contribuyan al desarrollo sostenible.',
      'Identificar y analizar los elementos del paisaje y su articulación en sistemas complejos naturales, rurales y urbanos, así como su evolución en el tiempo, interpretando las causas de las transformaciones y valorando el grado de equilibrio existente en los distintos ecosistemas, para promover su conservación, mejora y uso sostenible.',
      'Analizar de forma crítica planteamientos históricos y geográficos explicando la construcción de los sistemas democráticos y los principios constitucionales que rigen la vida en comunidad, así como asumiendo los deberes y derechos propios de nuestro marco de convivencia, para promover la participación ciudadana y la cohesión social.',
      'Comprender los procesos geográficos, históricos y culturales que han conformado la realidad multicultural en la que vivimos, conociendo y difundiendo la historia y cultura de las minorías étnicas presentes en nuestro país y valorando la aportación de los movimientos en defensa de la igualdad y la inclusión, para reducir estereotipos, evitar cualquier tipo de discriminación y violencia, y reconocer la riqueza de la diversidad.',
      'Identificar los fundamentos que sostienen las diversas identidades propias y las ajenas, a través del conocimiento y puesta en valor del patrimonio material e inmaterial que compartimos para conservarlo y respetar los sentimientos de pertenencia, así como para favorecer procesos que contribuyan a la cohesión y solidaridad territorial en orden a los valores del europeísmo y de la Declaración Universal de los Derechos Humanos.',
      'Tomar conciencia del papel de los ciclos demográficos, el ciclo vital, las formas de vida y las relaciones intergeneracionales y de dependencia en la sociedad actual y su evolución a lo largo del tiempo, analizándolas de forma crítica, para promover alternativas saludables, sostenibles, enriquecedoras y respetuosas con la dignidad humana y el compromiso con la sociedad y el entorno.',
      'Conocer y valorar la importancia de la seguridad integral ciudadana en la cultura de convivencia nacional e internacional, reconociendo la contribución del Estado, sus instituciones y otras entidades sociales a la ciudadanía global, a la paz, a la cooperación internacional y al desarrollo sostenible, para promover la consecución de un mundo más seguro, solidario, sostenible y justo.',
    ],
  },
  'bg-eso': {
    fuente: 'RD 217/2022, de 29 de marzo, anexo II (currículo estatal de la ESO)',
    competencias: [
      'Interpretar y transmitir información y datos científicos, argumentando sobre ellos y utilizando diferentes formatos, para analizar conceptos y procesos de las ciencias biológicas y geológicas.',
      'Identificar, localizar y seleccionar información, contrastando su veracidad, organizándola y evaluándola críticamente, para resolver preguntas relacionadas con las ciencias biológicas y geológicas.',
      'Planificar y desarrollar proyectos de investigación, siguiendo los pasos de las metodologías científicas y cooperando cuando sea necesario, para indagar en aspectos relacionados con las ciencias geológicas y biológicas.',
      'Utilizar el razonamiento y el pensamiento computacional, analizando críticamente las respuestas y soluciones y reformulando el procedimiento, si fuera necesario, para resolver problemas o dar explicación a procesos de la vida cotidiana relacionados con la biología y la geología.',
      'Analizar los efectos de determinadas acciones sobre el medio ambiente y la salud, basándose en los fundamentos de las ciencias biológicas y de la Tierra, para promover y adoptar hábitos que eviten o minimicen los impactos medioambientales negativos, sean compatibles con un desarrollo sostenible y permitan mantener y mejorar la salud individual y colectiva.',
      'Analizar los elementos de un paisaje concreto valorándolo como patrimonio natural y utilizando conocimientos sobre geología y ciencias de la Tierra para explicar su historia geológica, proponer acciones encaminadas a su protección e identificar posibles riesgos naturales.',
    ],
  },
  'fq-eso': {
    fuente: 'RD 217/2022, de 29 de marzo, anexo II (currículo estatal de la ESO)',
    competencias: [
      'Comprender y relacionar los motivos por los que ocurren los principales fenómenos fisicoquímicos del entorno, explicándolos en términos de las leyes y teorías científicas adecuadas, para resolver problemas con el fin de aplicarlas para mejorar la realidad cercana y la calidad de vida humana.',
      'Expresar las observaciones realizadas por el alumnado en forma de preguntas, formulando hipótesis para explicarlas y demostrando dichas hipótesis a través de la experimentación científica, la indagación y la búsqueda de evidencias, para desarrollar los razonamientos propios del pensamiento científico y mejorar las destrezas en el uso de las metodologías científicas.',
      'Manejar con soltura las reglas y normas básicas de la física y la química en lo referente al lenguaje de la IUPAC, al lenguaje matemático, al empleo de unidades de medida correctas, al uso seguro del laboratorio y a la interpretación y producción de datos e información en diferentes formatos y fuentes, para reconocer el carácter universal y transversal del lenguaje científico y la necesidad de una comunicación fiable en investigación y ciencia entre diferentes países y culturas.',
      'Utilizar de forma crítica, eficiente y segura plataformas digitales y recursos variados, tanto para el trabajo individual como en equipo, para fomentar la creatividad, el desarrollo personal y el aprendizaje individual y social, mediante la consulta de información, la creación de materiales y la comunicación efectiva en los diferentes entornos de aprendizaje.',
      'Utilizar las estrategias propias del trabajo colaborativo, potenciando el crecimiento entre iguales como base emprendedora de una comunidad científica crítica, ética y eficiente, para comprender la importancia de la ciencia en la mejora de la sociedad, las aplicaciones y repercusiones de los avances científicos, la preservación de la salud y la conservación sostenible del medio ambiente.',
      'Comprender y valorar la ciencia como una construcción colectiva en continuo cambio y evolución, en la que no solo participan las personas dedicadas a ella, sino que también requiere de una interacción con el resto de la sociedad, para obtener resultados que repercutan en el avance tecnológico, económico, ambiental y social.',
    ],
  },
  'ingles-eso': {
    fuente: 'RD 217/2022, de 29 de marzo, anexo II (currículo estatal de la ESO, materia Lengua Extranjera)',
    competencias: [
      'Comprender e interpretar el sentido general y los detalles más relevantes de textos expresados de forma clara y en la lengua estándar, buscando fuentes fiables y haciendo uso de estrategias como la inferencia de significados, para responder a necesidades comunicativas concretas.',
      'Producir textos originales, de extensión media, sencillos y con una organización clara, usando estrategias tales como la planificación, la compensación o la autorreparación, para expresar de forma creativa, adecuada y coherente mensajes relevantes y responder a propósitos comunicativos concretos.',
      'Interactuar con otras personas con creciente autonomía, usando estrategias de cooperación y empleando recursos analógicos y digitales, para responder a propósitos comunicativos concretos en intercambios respetuosos con las normas de cortesía.',
      'Mediar en situaciones cotidianas entre distintas lenguas, usando estrategias y conocimientos sencillos orientados a explicar conceptos o simplificar mensajes, para transmitir información de manera eficaz, clara y responsable.',
      'Ampliar y usar los repertorios lingüísticos personales entre distintas lenguas, reflexionando de forma crítica sobre su funcionamiento y tomando conciencia de las estrategias y conocimientos propios, para mejorar la respuesta a necesidades comunicativas concretas.',
      'Valorar críticamente y adecuarse a la diversidad lingüística, cultural y artística a partir de la lengua extranjera, identificando y compartiendo las semejanzas y las diferencias entre lenguas y culturas, para actuar de forma empática y respetuosa en situaciones interculturales.',
    ],
  },
  'tecnologia-eso': {
    fuente: 'RD 217/2022, de 29 de marzo, anexo II (currículo estatal de la ESO)',
    competencias: [
      'Buscar y seleccionar la información adecuada proveniente de diversas fuentes, de manera crítica y segura, aplicando procesos de investigación, métodos de análisis de productos y experimentando con herramientas de simulación, para definir problemas tecnológicos e iniciar procesos de creación de soluciones a partir de la información obtenida.',
      'Abordar problemas tecnológicos con autonomía y actitud creativa, aplicando conocimientos interdisciplinares y trabajando de forma cooperativa y colaborativa, para diseñar y planificar soluciones a un problema o necesidad de forma eficaz, innovadora y sostenible.',
      'Aplicar de forma apropiada y segura distintas técnicas y conocimientos interdisciplinares utilizando operadores, sistemas tecnológicos y herramientas, teniendo en cuenta la planificación y el diseño previo, para construir o fabricar soluciones tecnológicas y sostenibles que den respuesta a necesidades en diferentes contextos.',
      'Describir, representar e intercambiar ideas o soluciones a problemas tecnológicos o digitales, utilizando medios de representación, simbología y vocabulario adecuados, así como los instrumentos y recursos disponibles y valorando la utilidad de las herramientas digitales, para comunicar y difundir información y propuestas.',
      'Desarrollar algoritmos y aplicaciones informáticas en distintos entornos, aplicando los principios del pensamiento computacional e incorporando las tecnologías emergentes, para crear soluciones a problemas concretos, automatizar procesos y aplicarlos en sistemas de control o en robótica.',
      'Comprender los fundamentos del funcionamiento de los dispositivos y aplicaciones habituales de su entorno digital de aprendizaje, analizando sus componentes y funciones y ajustándolos a sus necesidades, para hacer un uso más eficiente y seguro de los mismos y para detectar y resolver problemas técnicos sencillos.',
      'Hacer un uso responsable y ético de la tecnología, mostrando interés por un desarrollo sostenible, identificando sus repercusiones y valorando la contribución de las tecnologías emergentes, para identificar las aportaciones y el impacto del desarrollo tecnológico en la sociedad y en el entorno.',
    ],
  },
  'ef-eso': {
    fuente: 'RD 217/2022, de 29 de marzo, anexo II (currículo estatal de la ESO)',
    competencias: [
      'Adoptar un estilo de vida activo y saludable, seleccionando e incorporando intencionalmente actividades físicas y deportivas en las rutinas diarias a partir de un análisis crítico de los modelos corporales y del rechazo de las prácticas que carezcan de base científica, para hacer un uso saludable y autónomo del tiempo libre y así mejorar la calidad de vida.',
      'Adaptar, con progresiva autonomía en su ejecución, las capacidades físicas, perceptivo-motrices y coordinativas, así como las habilidades y destrezas motrices, aplicando procesos de percepción, decisión y ejecución adecuados a la lógica interna y a los objetivos de diferentes situaciones con dificultad variable, para resolver situaciones de carácter motor vinculadas con distintas actividades físicas funcionales, deportivas, expresivas y recreativas, y para consolidar actitudes de superación, crecimiento y resiliencia al enfrentarse a desafíos físicos.',
      'Compartir espacios de práctica físico-deportiva con independencia de las diferencias culturales, sociales, de género y de habilidad, priorizando el respeto entre participantes y a las reglas sobre los resultados, adoptando una actitud crítica ante comportamientos antideportivos o contrarios a la convivencia y desarrollando procesos de autorregulación emocional que canalicen el fracaso y el éxito en estas situaciones, para contribuir con progresiva autonomía al entendimiento social y al compromiso ético en los diferentes espacios en los que se participa.',
      'Practicar, analizar y valorar distintas manifestaciones de la cultura motriz aprovechando las posibilidades y recursos expresivos que ofrecen el cuerpo y el movimiento y profundizando en las consecuencias del deporte como fenómeno social, analizando críticamente sus manifestaciones desde la perspectiva de género y desde los intereses económico-políticos que lo rodean, para alcanzar una visión más realista, contextualizada y justa de la motricidad en el marco de las sociedades actuales.',
      'Adoptar un estilo de vida sostenible y ecosocialmente responsable aplicando medidas de seguridad individuales y colectivas en la práctica físico-deportiva según el entorno y desarrollando colaborativa y cooperativamente acciones de servicio a la comunidad vinculadas a la actividad física y al deporte, para contribuir activamente a la conservación del medio natural y urbano.',
    ],
  },
  'epva-eso': {
    fuente: 'RD 217/2022, de 29 de marzo, anexo II (currículo estatal de la ESO)',
    competencias: [
      'Comprender la importancia que algunos ejemplos seleccionados de las distintas manifestaciones culturales y artísticas han tenido en el desarrollo del ser humano, mostrando interés por el patrimonio como parte de la propia cultura, para entender cómo se convierten en el testimonio de los valores y convicciones de cada persona y de la sociedad en su conjunto, y para reconocer la necesidad de su protección y conservación.',
      'Explicar las producciones plásticas, visuales y audiovisuales propias, comparándolas con las de sus iguales y con algunas de las que conforman el patrimonio cultural y artístico, justificando las opiniones y teniendo en cuenta el progreso desde la intención hasta la realización, para valorar el intercambio, las experiencias compartidas y el diálogo intercultural, así como para superar estereotipos.',
      'Analizar diferentes propuestas plásticas, visuales y audiovisuales, mostrando respeto y desarrollando la capacidad de observación e interiorización de la experiencia y del disfrute estético, para enriquecer la cultura artística individual y alimentar el imaginario.',
      'Explorar las técnicas, los lenguajes y las intenciones de diferentes producciones culturales y artísticas, analizando, de forma abierta y respetuosa, tanto el proceso como el producto final, su recepción y su contexto, para descubrir las diversas posibilidades que ofrecen como fuente generadora de ideas y respuestas.',
      'Realizar producciones artísticas individuales o colectivas con creatividad e imaginación, seleccionando y aplicando herramientas, técnicas y soportes en función de la intencionalidad, para expresar la visión del mundo, las emociones y los sentimientos propios, así como para mejorar la capacidad de comunicación y desarrollar la reflexión crítica y la autoconfianza.',
      'Apropiarse de las referencias culturales y artísticas del entorno, identificando sus singularidades, para enriquecer las creaciones propias y desarrollar la identidad personal, cultural y social.',
      'Aplicar las principales técnicas, recursos y convenciones de los lenguajes artísticos, incorporando, de forma creativa, las posibilidades que ofrecen las diversas tecnologías, para integrarlos y enriquecer el diseño y la realización de un proyecto artístico.',
      'Compartir producciones y manifestaciones artísticas, adaptando el proyecto a la intención y a las características del público destinatario, para valorar distintas oportunidades de desarrollo personal.',
    ],
  },
  'musica-eso': {
    fuente: 'RD 217/2022, de 29 de marzo, anexo II (currículo estatal de la ESO)',
    competencias: [
      'Analizar obras de diferentes épocas y culturas, identificando sus principales rasgos estilísticos y estableciendo relaciones con su contexto, para valorar el patrimonio musical y dancístico como fuente de disfrute y enriquecimiento personal.',
      'Explorar las posibilidades expresivas de diferentes técnicas musicales y dancísticas, a través de actividades de improvisación, para incorporarlas al repertorio personal de recursos y desarrollar el criterio de selección de las técnicas más adecuadas a la intención expresiva.',
      'Interpretar piezas musicales y dancísticas, gestionando adecuadamente las emociones y empleando diversas estrategias y técnicas vocales, corporales o instrumentales, para ampliar las posibilidades de expresión personal.',
      'Crear propuestas artístico-musicales, empleando la voz, el cuerpo, instrumentos musicales y herramientas tecnológicas, para potenciar la creatividad e identificar oportunidades de desarrollo personal, social, académico y profesional.',
    ],
  },
  'economia-eso': {
    fuente: 'RD 217/2022, de 29 de marzo, anexo II (currículo estatal de la ESO)',
    competencias: [
      'Analizar y valorar las fortalezas y debilidades propias y de los demás, reflexionando sobre las aptitudes y gestionando de forma eficaz las emociones y las destrezas necesarias, para adaptarse a entornos cambiantes y diseñar un proyecto personal que genere valor para los demás.',
      'Utilizar estrategias de conformación de equipos, así como habilidades sociales, de comunicación e innovación ágil, aplicándolas con autonomía y motivación a las dinámicas de trabajo en distintos contextos, para constituir equipos eficaces y descubrir el valor de cooperar con otras personas durante el proceso de ideación y desarrollo de soluciones emprendedoras.',
      'Elaborar, con sentido ético y solidario, ideas y soluciones innovadoras y sostenibles que den respuesta a las necesidades locales y globales detectadas, utilizando metodologías ágiles de ideación y analizando tanto sus puntos fuertes y débiles como el impacto que puedan generar esas ideas en el entorno, para lograr la superación de retos relacionados con la preservación y cuidado del medio natural, social, cultural y artístico.',
      'Seleccionar y reunir los recursos disponibles en el proceso de desarrollo de la idea o solución creativa propuesta, conociendo los medios de producción y las fuentes financieras que proporcionan dichos recursos y aplicando estrategias de captación de los mismos, para poner en marcha el proyecto que lleve a la realidad la solución emprendedora.',
      'Presentar y exponer ideas y soluciones creativas, utilizando estrategias comunicativas ágiles y valorando la importancia de una comunicación efectiva y respetuosa, para transmitir mensajes convincentes adecuados al contexto y a los objetivos concretos de cada situación y validar las ideas y soluciones presentadas.',
      'Comprender aspectos básicos de la economía y las finanzas, valorando críticamente el problema de la escasez de recursos y la necesidad de elegir, así como los principios de interacción social desde el punto de vista económico, para relacionar dichos aspectos con la búsqueda y planificación de los recursos necesarios en el desarrollo de la idea o solución emprendedora que afronte el reto planteado de manera eficiente, equitativa y sostenible.',
      'Construir y analizar de manera cooperativa, autónoma y ágil prototipos innovadores y sostenibles, aplicando estrategias eficaces de diseño y ejecución, evaluando todas las fases del proceso de manera crítica y ética y validando los resultados obtenidos, para mejorar y perfeccionar los prototipos creados y para contribuir al aprendizaje y el desarrollo personal y colectivo.',
    ],
  },
};

export const curriculoLiteralPorSemilla = (semillaId: string): CurriculoLiteral | undefined =>
  CURRICULO_LITERAL[semillaId];
