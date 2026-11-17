import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TIPOS_ACTA, construirActa, defectosActa, type DatosActa } from '../../data/centro';
import { usePerfil } from '../../store/perfil';
import { useHistorial } from '../../store/historial';
import { Campo } from '../../components/Campo';
import { DocPreview } from '../../components/DocPreview';
import { Btn, Card, PageHeader, Stepper } from '../../components/ui';
import type { CampoDef } from '../../data/tramites';

const PASOS = ['Datos de la reunión', 'Asistentes y orden del día', 'Desarrollo y acuerdos'];

export default function ActaWizard() {
  const [params] = useSearchParams();
  const { perfil } = usePerfil();
  const historial = useHistorial();

  const [d, setD] = useState<DatosActa>(() => {
    const docId = params.get('doc');
    if (docId) {
      const doc = historial.obtener(docId);
      if (doc && doc.tipo === 'acta') return { ...defectosActa(), ...(doc.datos as unknown as DatosActa) };
    }
    return defectosActa();
  });
  const [paso, setPaso] = useState(0);
  const [guardado, setGuardado] = useState(false);

  const set = (k: keyof DatosActa, v: string) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setGuardado(false);
  };

  const campos: CampoDef[][] = [
    [
      { tipo: 'select', id: 'tipo', etiqueta: 'Tipo de acta', opciones: TIPOS_ACTA.map((t) => ({ valor: t, etiqueta: t })) },
      { tipo: 'text', id: 'numero', etiqueta: 'Nº de acta', placeholder: '1, 2, 3…' },
      { tipo: 'date', id: 'fecha', etiqueta: 'Fecha', requerido: true },
      { tipo: 'text', id: 'horaInicio', etiqueta: 'Hora de inicio', placeholder: '17:00' },
      { tipo: 'text', id: 'horaFin', etiqueta: 'Hora de finalización', placeholder: '19:30' },
      { tipo: 'text', id: 'lugar', etiqueta: 'Lugar', placeholder: 'Sala de profesores' },
      { tipo: 'text', id: 'presidente', etiqueta: 'Preside' },
      { tipo: 'text', id: 'secretario', etiqueta: 'Acta/secretaría' },
    ],
    [
      {
        tipo: 'textarea',
        id: 'asistentes',
        etiqueta: 'Asistentes — una línea por persona',
        filas: 6,
        placeholder: 'Nombre Apellido — Jefa de departamento\nNombre Apellido — Docente de Matemáticas',
      },
      {
        tipo: 'textarea',
        id: 'ordenDia',
        etiqueta: 'Orden del día — un punto por línea',
        filas: 5,
      },
    ],
    [
      { tipo: 'textarea', id: 'desarrollo', etiqueta: 'Desarrollo de la sesión', filas: 10, ayuda: 'Usa «Punto 1.», «Punto 2.»… para estructurar los párrafos.' },
      { tipo: 'textarea', id: 'acuerdos', etiqueta: 'Acuerdos adoptados — uno por línea', filas: 4 },
      { tipo: 'date', id: 'proximaFecha', etiqueta: 'Próxima convocatoria (fecha)' },
      { tipo: 'text', id: 'proximoLugar', etiqueta: 'Próxima convocatoria (lugar)' },
    ],
  ];

  const doc = construirActa(d, perfil);
  const guardar = () => {
    historial.guardar({ tipo: 'acta', subtipo: d.tipo, titulo: doc.titulo, datos: { ...d } as unknown as Record<string, unknown> });
    setGuardado(true);
  };

  return (
    <div>
      <PageHeader titulo="Acta de reunión" descripcion="Actas de departamento, claustro, ETCP, equipo docente o consejo escolar listas para firmar." atras="/centro" />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(340px,0.85fr)_minmax(0,1.15fr)]">
        <Card className="p-5">
          <div className="mb-4">
            <Stepper pasos={PASOS} actual={paso} irA={setPaso} />
          </div>
          <h2 className="mb-3 font-semibold text-slate-800">{PASOS[paso]}</h2>
          {campos[paso].map((c) => (
            <Campo key={c.id} campo={c} valor={String(d[c.id as keyof DatosActa] ?? '')} onChange={(v) => set(c.id as keyof DatosActa, v as string)} />
          ))}
          <div className="flex items-center justify-between">
            <Btn variante="secundario" onClick={() => setPaso((p) => Math.max(0, p - 1))} deshabilitado={paso === 0}>
              ← Anterior
            </Btn>
            {paso === PASOS.length - 1 ? (
              <a href="#vista-previa">
                <Btn>Ver documento ↓</Btn>
              </a>
            ) : (
              <Btn onClick={() => setPaso((p) => Math.min(PASOS.length - 1, p + 1))}>Siguiente →</Btn>
            )}
          </div>
        </Card>
        <div id="vista-previa" className="scroll-mt-4">
          <DocPreview titulo={doc.titulo} bloques={doc.bloques} alGuardar={guardar} guardado={guardado} />
        </div>
      </div>
    </div>
  );
}
