import { useMemo, useState } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { tramitePorId, type DatosTramite } from '../../data/tramites';
import { ccaaPorId } from '../../data/ccaa';
import { usePerfil, perfilCompleto } from '../../store/perfil';
import { useHistorial } from '../../store/historial';
import { Campo } from '../../components/Campo';
import { DocPreview } from '../../components/DocPreview';
import { Btn, Card, Nota, PageHeader, Stepper } from '../../components/ui';

export default function TramiteWizard() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const def = tramitePorId(id ?? '');
  const { perfil } = usePerfil();
  const historial = useHistorial();
  const ccaa = ccaaPorId(perfil.ccaa);
  const ctx = useMemo(() => ({ perfil, ccaa }), [perfil, ccaa]);
  const lineasNormativa = ccaa?.normativa?.notas?.length
    ? ccaa.normativa.notas
    : [ccaa?.normativa?.permisos, ccaa?.normativa?.sexenios].filter((x): x is string => Boolean(x));

  const [datos, setDatos] = useState<DatosTramite>(() => {
    // Reabrir un documento guardado
    const docId = params.get('doc');
    if (docId) {
      const d = historial.obtener(docId);
      if (d && d.tipo === 'tramite') return { ...d.datos } as DatosTramite;
    }
    // Valores por defecto: defectos() del trámite + perfil + defecto del campo
    const base: DatosTramite = {};
    if (def?.defectos) Object.assign(base, def.defectos(ctx));
    for (const paso of def?.pasos ?? [])
      for (const c of paso.campos) {
        if (base[c.id] !== undefined) continue;
        if (c.dePerfil) base[c.id] = String(perfil[c.dePerfil] ?? '');
        else if (c.defecto !== undefined) base[c.id] = String(c.defecto);
      }
    return base;
  });
  const [paso, setPaso] = useState(0);
  const [guardado, setGuardado] = useState(false);

  if (!def) return <Navigate to="/tramites" replace />;

  const pasos = def.pasos;
  const camposActuales = pasos[paso].campos;
  const faltan = camposActuales
    .filter((c) => c.requerido && c.tipo !== 'info')
    .filter((c) => !String(datos[c.id] ?? '').trim());
  const ultimoPaso = paso === pasos.length - 1;

  const doc = def.construir(datos, ctx);

  const guardar = () => {
    historial.guardar({ tipo: 'tramite', subtipo: def.id, titulo: doc.titulo, datos });
    setGuardado(true);
  };

  return (
    <div>
      <PageHeader titulo={def.nombre} descripcion={def.resumen} atras="/tramites" />

      {!perfilCompleto(perfil) && (
        <Nota tono="aviso">
          Tu <a className="font-semibold underline" href="/perfil">perfil</a> está incompleto: el documento saldrá con huecos.
          Complétalo una vez y se rellenará solo en todos los trámites.
        </Nota>
      )}

      {ccaa && (
        <Card className="mt-4 p-4">
          <h2 className="text-sm font-semibold text-slate-700">📍 Normativa de {ccaa.nombre}</h2>
          {lineasNormativa.length > 0 ? (
            <ul className="mt-2 ml-4 list-disc space-y-1 text-sm text-slate-600">
              {lineasNormativa.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              No tenemos normativa precargada de esta comunidad: verifica el procedimiento en la{' '}
              <a className="underline" href={ccaa.sede} target="_blank" rel="noreferrer">
                sede electrónica
              </a>
              .
            </p>
          )}
          <p className="mt-2 text-xs text-slate-400">
            La educación es una competencia transferida: cada comunidad regula su currículo, permisos y tramos. Verifica siempre la norma vigente.
          </p>
        </Card>
      )}

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(340px,0.85fr)_minmax(0,1.15fr)]">
        {/* Formulario */}
        <div>
          <Card className="p-5">
            <div className="mb-4">
              <Stepper pasos={pasos.map((p) => p.titulo)} actual={paso} irA={setPaso} />
            </div>

            {paso === 0 && def.avisos?.length ? (
              <Nota tono="aviso">
                <p className="mb-1 font-semibold">Antes de empezar, ten en cuenta:</p>
                <ul className="ml-4 list-disc space-y-1">
                  {def.avisos.map((a) => (
                    <li key={a} dangerouslySetInnerHTML={{ __html: a.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') }} />
                  ))}
                </ul>
              </Nota>
            ) : null}

            <div className="mt-4">
              {camposActuales.map((c) => (
                <Campo
                  key={c.id}
                  campo={c}
                  valor={datos[c.id]}
                  onChange={(v) => {
                    setDatos((d) => ({ ...d, [c.id]: v as string }));
                    setGuardado(false);
                  }}
                />
              ))}
            </div>

            {faltan.length > 0 && (
              <p className="mb-3 text-sm text-red-600">
                Completa los campos obligatorios: {faltan.map((f) => f.etiqueta).join(', ')}.
              </p>
            )}

            <div className="flex items-center justify-between">
              <Btn variante="secundario" onClick={() => setPaso((p) => Math.max(0, p - 1))} deshabilitado={paso === 0}>
                ← Anterior
              </Btn>
              {ultimoPaso ? (
                <a href="#vista-previa">
                  <Btn deshabilitado={faltan.length > 0}>Ver documento ↓</Btn>
                </a>
              ) : (
                <Btn onClick={() => setPaso((p) => Math.min(pasos.length - 1, p + 1))} deshabilitado={faltan.length > 0}>
                  Siguiente →
                </Btn>
              )}
            </div>
          </Card>
        </div>

        {/* Vista previa */}
        <div id="vista-previa" className="scroll-mt-4">
          <DocPreview titulo={doc.titulo} bloques={doc.bloques} alGuardar={guardar} guardado={guardado} />
        </div>
      </div>
    </div>
  );
}
