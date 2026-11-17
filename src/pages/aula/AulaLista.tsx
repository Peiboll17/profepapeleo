import { Link } from 'react-router-dom';
import { Card, PageHeader } from '../../components/ui';

const HERRAMIENTAS = [
  {
    to: '/aula/programacion',
    emoji: '📚',
    nombre: 'Programación didáctica LOMLOE',
    texto: 'Documento completo con 13 secciones precargadas: competencias, saberes, metodología, atención a la diversidad, calificación… Plantillas de materias frecuentes y ampliación con IA opcional.',
  },
  {
    to: '/aula/rubrica',
    emoji: '📊',
    nombre: 'Rúbrica de evaluación',
    texto: 'Tabla criterios × niveles con descriptores generables por IA. Exportable a Word y PDF.',
  },
];

export default function AulaLista() {
  return (
    <div>
      <PageHeader
        titulo="Documentos de aula"
        descripcion="Lo que necesitas para tu materia: programaciones didácticas conforme a la LOMLOE y rúbricas."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {HERRAMIENTAS.map((h) => (
          <Link key={h.to} to={h.to}>
            <Card className="h-full p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{h.emoji}</span>
                <div>
                  <h2 className="font-semibold text-slate-800">{h.nombre}</h2>
                  <p className="mt-1 text-sm text-slate-500">{h.texto}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-semibold text-slate-800">🧭 Guía rápida LOMLOE</h2>
        <p className="mt-2 text-sm text-slate-600">
          La LOMLOE (LO 3/2020) ordena el currículo en <b>competencias específicas</b> (qué saber hacer con la materia),
          <b> criterios de evaluación</b> (el referente para evaluar) y <b>saberes básicos</b> (los contenidos mínimos).
          Las programaciones parten de «situaciones de aprendizaje»: tareas reales y contextualizadas que integran los
          tres elementos.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Currículo estatal: <b>RD 157/2022</b> (Primaria) y <b>RD 217/2022</b> (ESO y Bachillerato). Cada comunidad
          autónoma lo desarrolla con su propio decreto: recuerda ajustar el marco normativo en el paso 2 del asistente.
        </p>
      </Card>
    </div>
  );
}
