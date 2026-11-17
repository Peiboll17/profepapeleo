import { Link } from 'react-router-dom';
import { TRAMITES } from '../../data/tramites';
import { Card, PageHeader } from '../../components/ui';

export default function TramitesLista() {
  return (
    <div>
      <PageHeader
        titulo="Trámites y escritos"
        descripcion="Asistentes paso a paso que generan el documento listo para registrar. Rellenan tus datos automáticamente desde tu perfil."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {TRAMITES.map((t) => (
          <Link key={t.id} to={`/tramites/${t.id}`}>
            <Card className="h-full p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{t.emoji}</span>
                <div>
                  <h2 className="font-semibold text-slate-800">{t.nombre}</h2>
                  <p className="mt-1 text-sm text-slate-500">{t.resumen}</p>
                  {t.avisos?.length ? (
                    <p className="mt-2 text-xs text-amber-700">⚠ Revisa los requisitos antes de empezar</p>
                  ) : null}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-semibold text-slate-800">📌 Cómo presentar un escrito</h2>
        <ol className="mt-2 ml-4 list-decimal space-y-1 text-sm text-slate-600">
          <li>Genera el documento aquí (PDF o Word) y revísalo.</li>
          <li>Fírmalo (digitalizada o en mano tras imprimir).</li>
          <li>
            Regístralo en el <b>registro electrónico</b> de tu consejería (necesitas certificado digital o Cl@ve) o en
            papel en el registro del propio centro.
          </li>
          <li>Guarda la copia con el número de registro: es tu justificante.</li>
        </ol>
        <p className="mt-3 text-xs text-slate-400">
          Ley 39/2015: puedes presentar escritos en cualquier registro público, pero conviene usar el de la consejería
          para agilizar su tramitación.
        </p>
      </Card>
    </div>
  );
}
