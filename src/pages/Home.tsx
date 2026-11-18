import { Link } from 'react-router-dom';
import { perfilCompleto, usePerfil, nombreCompleto } from '../store/perfil';
import { useHistorial } from '../store/historial';
import { ccaaPorId } from '../data/ccaa';
import { cursoActual } from '../lib/format';
import { Badge, Btn, Card, Nota } from '../components/ui';

const MODULOS = [
  {
    to: '/tramites',
    emoji: '🏛️',
    nombre: 'Trámites y escritos',
    texto: 'Permisos, licencias, bajas, escritos a inspección y sexenios: la instancia formal lista para registrar.',
    tono: 'bg-teal-50 border-teal-200',
  },
  {
    to: '/aula',
    emoji: '📚',
    nombre: 'Documentos de aula',
    texto: 'Programaciones didácticas LOMLOE completas y rúbricas de evaluación con plantillas por materia.',
    tono: 'bg-amber-50 border-amber-200',
  },
  {
    to: '/centro',
    emoji: '🏫',
    nombre: 'Documentos de centro',
    texto: 'Actas de departamento y claustro, esqueleto de la PGA y de la memoria anual.',
    tono: 'bg-sky-50 border-sky-200',
  },
];

export default function Home() {
  const { perfil, guardar } = usePerfil();
  const { docs } = useHistorial();
  const ccaa = ccaaPorId(perfil.ccaa);

  return (
    <div>
      {/* Hero */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Tu papeleo docente, <span className="text-teal-700">en minutos</span>
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Genera trámites administrativos, programaciones didácticas y documentos de centro cumplimentando un
          formulario. Todo listo para imprimir en PDF o editar en Word. Curso {cursoActual()}.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {docs.length > 0 && (
            <Link to="/historial">
              <Btn variante="secundario">🗂️ Mis documentos ({docs.length})</Btn>
            </Link>
          )}
        </div>
      </section>

      {/* Aviso de perfil */}
      {!perfilCompleto(perfil) ? (
        <Nota tono="aviso">
          <b>Empieza por tu perfil</b> — se rellena una vez y autocompleta todos los documentos.{' '}
          <Link to="/perfil" className="font-semibold underline">
            Completar ahora →
          </Link>
          {' · '}
          <button
            type="button"
            onClick={() =>
              guardar({
                nombre: 'Ana',
                apellidos: 'García López',
                dni: '12345678Z',
                ccaa: 'madrid',
                cuerpo: 'Cuerpo de Profesores de Enseñanza Secundaria',
                especialidad: 'Matemáticas',
                centro: 'IES Ejemplo',
                codCentro: '28078000',
                localidad: 'Madrid',
                provincia: 'Madrid',
                email: 'ana@example.es',
                telefono: '600 000 000',
                fechaNombramiento: '2018-09-01',
                regimen: 'publico',
                funcionario: true,
              })
            }
            className="font-semibold underline"
          >
            🧪 Probar con datos de ejemplo
          </button>
        </Nota>
      ) : (
        <Nota tono="exito">
          Hola, {nombreCompleto(perfil)} · {ccaa?.nombre ?? perfil.ccaa} — perfil listo, tus documentos se autocompletan.{' '}
          <Link to="/perfil" className="underline">
            Editar
          </Link>
        </Nota>
      )}

      {/* Módulos */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {MODULOS.map((m) => (
          <Link key={m.to} to={m.to}>
            <Card className={`h-full border p-5 transition-shadow hover:shadow-md ${m.tono}`}>
              <span className="text-3xl">{m.emoji}</span>
              <h2 className="mt-3 text-lg font-semibold text-slate-800">{m.nombre}</h2>
              <p className="mt-1 text-sm text-slate-600">{m.texto}</p>
              <p className="mt-3 text-sm font-medium text-teal-800">Abrir →</p>
            </Card>
          </Link>
        ))}
      </section>

      {/* Destacado trámite del mes */}
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Badge tono="ambar">💡 Sabías que…</Badge>
          </div>
          <h3 className="mt-2 font-semibold text-slate-800">Los sexenios no se conceden solos</h3>
          <p className="mt-1 text-sm text-slate-600">
            Solo se reconocen si los solicitas, con la formación acreditada que exija tu convocatoria. Cada año que
            tardas es un tramo (y su complemento) que se retrasa seis años.
          </p>
          <Link to="/tramites/sexenios" className="mt-2 inline-block text-sm font-medium text-teal-700 hover:underline">
            Preparar mi solicitud →
          </Link>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Badge tono="teal">🔒 Privacidad</Badge>
          </div>
          <h3 className="mt-2 font-semibold text-slate-800">Tus datos se quedan en tu navegador</h3>
          <p className="mt-1 text-sm text-slate-600">
            ProfePapeleo funciona sin servidores: perfil e historial viven en tu equipo. La IA es opcional y usa tu
            propia clave si la activas.
          </p>
          <Link to="/ajustes" className="mt-2 inline-block text-sm font-medium text-teal-700 hover:underline">
            Ver ajustes →
          </Link>
        </Card>
      </section>
    </div>
  );
}
