import { useMemo, useState } from 'react';
import { HITOS_CURSO, AVISOS_FLEXIBLES } from '../data/calendario';
import { ccaaPorId } from '../data/ccaa';
import { usePerfil } from '../store/perfil';
import { descargarBlob } from '../lib/download';
import { generarIcs } from '../lib/ics';
import { Btn, Card, Nota, PageHeader } from '../components/ui';

export default function CalendarioPage() {
  const { perfil } = usePerfil();
  const ccaa = ccaaPorId(perfil.ccaa);

  const [fechas, setFechas] = useState<Record<string, string>>(() => {
    const iniciales: Record<string, string> = {};
    for (const mes of HITOS_CURSO) for (const h of mes.hitos) iniciales[h.nombre] = h.fecha;
    return iniciales;
  });

  const todosLosHitos = useMemo(
    () => HITOS_CURSO.flatMap((m) => m.hitos).map((h) => ({ ...h, fecha: fechas[h.nombre] ?? h.fecha })),
    [fechas],
  );

  const exportar = () => {
    const ics = generarIcs(todosLosHitos);
    descargarBlob(new Blob([ics], { type: 'text/calendar;charset=utf-8' }), `calendario-docente-${new Date().toISOString().slice(0, 10)}.ics`);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        titulo="Calendario del docente"
        descripcion="Los hitos típicos del curso escolar con fechas orientativas. Ajusta las fechas a tu centro y descárgalas para tu calendario (Google Calendar, Outlook…)."
        atras="/"
      />

      <div className="mb-4 flex items-center gap-3">
        <Btn onClick={exportar}>📅 Descargar calendario (.ics)</Btn>
        <span className="text-sm text-slate-500">{todosLosHitos.length} hitos con fecha</span>
      </div>

      <Nota tono="aviso">
        ⚠️ Las fechas son <b>orientativas</b>: cada centro y comunidad autónoma fija el calendario escolar y las sesiones
        de evaluación en su normativa anual. Ajusta las fechas antes de exportar.
      </Nota>

      <div className="mt-4 space-y-4">
        {HITOS_CURSO.map((mes) => (
          <Card key={mes.mes} className="p-5">
            <h2 className="mb-3 text-lg font-semibold text-teal-800">{mes.mes}</h2>
            <div className="space-y-3">
              {mes.hitos.map((h) => (
                <div key={h.nombre} className="flex flex-wrap items-start gap-3 rounded-lg border border-slate-100 p-3">
                  <div className="min-w-0 grow">
                    <p className="font-medium text-slate-800">{h.nombre}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{h.descripcion}</p>
                  </div>
                  <input
                    type="date"
                    aria-label={`Fecha de ${h.nombre}`}
                    className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                    value={fechas[h.nombre] ?? h.fecha}
                    onChange={(e) => setFechas((f) => ({ ...f, [h.nombre]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">🔔 Sin fecha fija: depends de tu comunidad</h2>
        <div className="space-y-3">
          {AVISOS_FLEXIBLES.map((a) => (
            <div key={a.nombre} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="font-medium text-amber-900">{a.nombre}</p>
              <p className="mt-0.5 text-sm text-amber-800">{a.texto}</p>
            </div>
          ))}
          {ccaa && (
            <p className="text-xs text-slate-400">
              Consulta la normativa y convocatorias de {ccaa.nombre} en su{' '}
              <a className="underline" href={ccaa.sede} target="_blank" rel="noreferrer">
                sede electrónica
              </a>
              .
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
