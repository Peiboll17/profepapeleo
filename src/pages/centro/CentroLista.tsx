import { Link } from 'react-router-dom';
import { Card, Nota, PageHeader } from '../../components/ui';
import { ccaaPorId } from '../../data/ccaa';
import { usePerfil } from '../../store/perfil';

const HERRAMIENTAS = [
  {
    to: '/centro/acta',
    emoji: '🗒️',
    nombre: 'Acta de reunión',
    texto: 'Departamento, claustro, ETCP, equipo docente o consejo escolar: asistentes, orden del día, acuerdos y próxima convocatoria.',
  },
  {
    to: '/centro/esqueleto?tipo=pga',
    emoji: '🏫',
    nombre: 'Programación General Anual',
    texto: 'Esqueleto completo con 15 apartados: contexto, objetivos, planes, cargas horarias y calendario.',
  },
  {
    to: '/centro/esqueleto?tipo=memoria',
    emoji: '📝',
    nombre: 'Memoria anual',
    texto: 'Valoración de resultados y de los planes del curso, con propuestas de mejora para el año siguiente.',
  },
];

export default function CentroLista() {
  const { perfil } = usePerfil();
  const ccaa = ccaaPorId(perfil.ccaa);

  return (
    <div>
      <PageHeader
        titulo="Documentos de centro"
        descripcion="Los documentos institucionales que más tiempo consumen a jefaturas y departamentos, generados con estructura completa."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HERRAMIENTAS.map((h) => (
          <Link key={h.to} to={h.to}>
            <Card className="h-full p-5 transition-shadow hover:shadow-md">
              <span className="text-2xl">{h.emoji}</span>
              <h2 className="mt-2 font-semibold text-slate-800">{h.nombre}</h2>
              <p className="mt-1 text-sm text-slate-500">{h.texto}</p>
            </Card>
          </Link>
        ))}
      </div>

      {ccaa?.normativa?.organizacion && (
        <div className="mt-6">
          <Nota tono="info">
            En <b>{ccaa.nombre}</b>: {ccaa.normativa.organizacion}. Esa norma define la estructura de los documentos de centro.
          </Nota>
        </div>
      )}

      <Card className="mt-6 p-5">
        <h2 className="font-semibold text-slate-800">🗺️ Mapa de documentos del centro</h2>
        <ul className="mt-2 ml-4 list-disc space-y-1 text-sm text-slate-600">
          <li><b>Plan de Centro</b> (cuatrienal): Proyecto Educativo + Proyecto de Gestión + ROF/Normas de organización.</li>
          <li><b>Anuales</b>: la PGA (antes de iniciar el curso) y la Memoria de fin de curso que la evalúa.</li>
          <li><b>De coordinación</b>: programaciones didácticas (departamentos) y actas de todos los órganos.</li>
        </ul>
        <p className="mt-3 text-xs text-slate-400">
          El Plan de Centro completo varía mucho entre comunidades: si te interesa un asistente específico, cuéntanoslo.
        </p>
      </Card>
    </div>
  );
}
