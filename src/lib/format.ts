const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/** "2025-11-16" → "16 de noviembre de 2025". Acepta null/undefined → cadena vacía. */
export function fechaLarga(iso: string | null | undefined): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

/** Fecha de hoy en formato largo */
export function hoyLarga(): string {
  const now = new Date();
  return `${now.getDate()} de ${MESES[now.getMonth()]} de ${now.getFullYear()}`;
}

/** Curso escolar actual en formato "2025/2026" (cambia el 1 de agosto) */
export function cursoActual(now = new Date()): string {
  const y = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return `${y}/${y + 1}`;
}

/** Hoy en ISO (YYYY-MM-DD), evitando desfases de zona horaria */
export function hoyISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Suma días hábiles (lun-vie) a una fecha ISO */
export function sumarDiasHabiles(iso: string, dias: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const fecha = new Date(y, m - 1, d);
  let restantes = dias;
  while (restantes > 0) {
    fecha.setDate(fecha.getDate() + 1);
    const dow = fecha.getDay();
    if (dow !== 0 && dow !== 6) restantes--;
  }
  const yy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

/** Años completos transcurridos desde una fecha ISO (para antigüedad) */
export function aniosDesde(iso: string, ahora = new Date()): number {
  if (!iso) return 0;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y) return 0;
  let edad = ahora.getFullYear() - y;
  const mesActual = ahora.getMonth() + 1;
  if (mesActual < m || (mesActual === m && ahora.getDate() < d)) edad--;
  return edad;
}

/** Sustituye {variables} en una plantilla */
export function interpolar(
  plantilla: string,
  vars: Record<string, string | undefined | null>,
): string {
  return plantilla.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '');
}
