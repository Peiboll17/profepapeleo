import type { CampoDef } from '../data/tramites';

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100';

/** Renderiza un campo de formulario según su tipo */
export function Campo({
  campo,
  valor,
  onChange,
}: {
  campo: CampoDef;
  valor: string | boolean | number | undefined;
  onChange: (v: string | boolean) => void;
}) {
  if (campo.tipo === 'info') {
    return (
      <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900" dangerouslySetInnerHTML={{ __html: campo.html ?? '' }} />
    );
  }

  const label = (
    <label htmlFor={`campo-${campo.id}`} className="mb-1 block text-sm font-medium text-slate-700">
      {campo.etiqueta}
      {campo.requerido && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );

  let control: React.ReactNode;
  switch (campo.tipo) {
    case 'textarea':
      control = (
        <textarea
          id={`campo-${campo.id}`}
          className={`${inputBase} min-h-24 resize-y`}
          rows={campo.filas ?? 4}
          placeholder={campo.placeholder}
          value={String(valor ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case 'select':
      control = (
        <select
          id={`campo-${campo.id}`}
          className={inputBase}
          value={String(valor ?? campo.defecto ?? '')}
          onChange={(e) => onChange(e.target.value)}
        >
          {campo.opciones?.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.etiqueta}
            </option>
          ))}
        </select>
      );
      break;
    case 'date':
      control = (
        <input
          id={`campo-${campo.id}`}
          type="date"
          className={inputBase}
          value={String(valor ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case 'number':
      control = (
        <input
          id={`campo-${campo.id}`}
          type="number"
          min={0}
          className={inputBase}
          placeholder={campo.placeholder}
          value={String(valor ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case 'checkbox':
      return (
        <div className="flex items-start gap-2">
          <input
            id={`campo-${campo.id}`}
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-teal-700"
            checked={Boolean(valor)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <label htmlFor={`campo-${campo.id}`} className="text-sm text-slate-700">
            {campo.etiqueta}
          </label>
        </div>
      );
    default:
      control = (
        <input
          id={`campo-${campo.id}`}
          type="text"
          className={inputBase}
          placeholder={campo.placeholder}
          value={String(valor ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }

  return (
    <div className="mb-4">
      {label}
      {control}
      {campo.ayuda && <p className="mt-1 text-xs text-slate-400">{campo.ayuda}</p>}
    </div>
  );
}
