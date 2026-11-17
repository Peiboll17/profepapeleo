import { Link } from 'react-router-dom';
import { useHistorial } from '../store/historial';
import { Badge, Btn, Card, PageHeader, Vacio } from '../components/ui';

const RUTAS: Record<string, (subtipo: string) => string> = {
  tramite: (sub) => `/tramites/${sub}`,
  programacion: () => '/aula/programacion',
  rubrica: () => '/aula/rubrica',
  acta: () => '/centro/acta',
  pga: () => '/centro/esqueleto?tipo=pga',
  memoria: () => '/centro/esqueleto?tipo=memoria',
};

const NOMBRES: Record<string, string> = {
  tramite: 'Trámite',
  programacion: 'Programación',
  rubrica: 'Rúbrica',
  acta: 'Acta',
  pga: 'PGA',
  memoria: 'Memoria',
};

export default function PaginaHistorial() {
  const { docs, eliminar, duplicar } = useHistorial();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader titulo="Historial" descripcion="Todos los documentos que has guardado. Se conservan solo en este navegador." atras="/" />
      {docs.length === 0 ? (
        <Vacio
          emoji="🗂️"
          titulo="Aún no has guardado documentos"
          texto="Cuando generes un trámite, programación o acta, pulsa «Guardar» y aparecerá aquí para reabrirlo o duplicarlo."
          accion={
            <Link to="/tramites">
              <Btn>Crear mi primer documento</Btn>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {docs.map((d) => (
            <Card key={d.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 grow">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tono={d.tipo === 'tramite' ? 'teal' : d.tipo === 'acta' || d.tipo === 'pga' || d.tipo === 'memoria' ? 'ambar' : 'gris'}>
                    {NOMBRES[d.tipo] ?? d.tipo}
                  </Badge>
                  <span className="truncate font-medium text-slate-800">{d.titulo}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  Actualizado el {new Date(d.actualizado).toLocaleString('es-ES')}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`${RUTAS[d.tipo]?.(d.subtipo) ?? '/'}?doc=${d.id}`}>
                  <Btn pequeno>Abrir</Btn>
                </Link>
                <Btn pequeno variante="secundario" onClick={() => duplicar(d.id)}>
                  Duplicar
                </Btn>
                <Btn pequeno variante="peligro" onClick={() => confirm(`¿Eliminar «${d.titulo}»?`) && eliminar(d.id)}>
                  ✕
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
