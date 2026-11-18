/** Genera un archivo iCalendar (.ics) a partir de eventos con fecha ISO */
export interface EventoIcs {
  nombre: string;
  descripcion: string;
  /** Fecha ISO YYYY-MM-DD */
  fecha: string;
}

export function generarIcs(eventos: EventoIcs[]): string {
  const esc = (s: string) => s.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const lineas = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ProfePapeleo//Calendario docente//ES'];
  eventos.forEach((e, i) => {
    const fecha = e.fecha.replace(/-/g, '');
    lineas.push(
      'BEGIN:VEVENT',
      `UID:profepapeleo-${i}-${fecha}@local`,
      `DTSTART;VALUE=DATE:${fecha}`,
      `DTEND;VALUE=DATE:${fecha}`,
      `SUMMARY:${esc(e.nombre)}`,
      `DESCRIPTION:${esc(e.descripcion)}`,
      'END:VEVENT',
    );
  });
  lineas.push('END:VCALENDAR');
  return lineas.join('\r\n');
}
