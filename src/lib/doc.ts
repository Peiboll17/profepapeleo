/**
 * Modelo neutro de documento: cada asistente produce Bloque[] y los
 * renderizadores (HTML para pantalla/PDF, DOCX para Word) lo convierten.
 * Una sola fuente de verdad por documento.
 */

export type ClaseP = 'right' | 'center' | 'muted' | 'negrita';

export type Bloque =
  | { t: 'h1'; texto: string }
  | { t: 'h2'; texto: string }
  | { t: 'h3'; texto: string }
  | { t: 'p'; texto: string; clase?: ClaseP }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'tabla'; filas: string[][]; encabezado?: boolean }
  | { t: 'firma'; nombre?: string; cargo?: string }
  | { t: 'salto' };

export function esc(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escapa y convierte **negritas** en <b> */
export function textoHtml(s: string): string {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}

/** Convierte saltos de línea simples de un texto en párrafos */
export function parrafos(texto: string, clase?: ClaseP): Bloque[] {
  return String(texto ?? '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map<Bloque>((texto) => ({ t: 'p', texto, clase }));
}

/** Renderiza bloques a HTML (para la vista previa y para imprimir a PDF) */
export function renderHtml(bloques: Bloque[]): string {
  const out: string[] = [];
  for (const b of bloques) {
    switch (b.t) {
      case 'h1':
        out.push(`<h1>${esc(b.texto)}</h1>`);
        break;
      case 'h2':
        out.push(`<h2>${esc(b.texto)}</h2>`);
        break;
      case 'h3':
        out.push(`<h3>${esc(b.texto)}</h3>`);
        break;
      case 'p':
        out.push(`<p class="${claseHtml(b.clase)}">${textoHtml(b.texto)}</p>`);
        break;
      case 'ul':
        out.push(`<ul>${b.items.map((i) => `<li>${textoHtml(i)}</li>`).join('')}</ul>`);
        break;
      case 'ol':
        out.push(`<ol>${b.items.map((i) => `<li>${textoHtml(i)}</li>`).join('')}</ol>`);
        break;
      case 'tabla':
        out.push(renderTablaHtml(b.filas, b.encabezado));
        break;
      case 'firma':
        out.push(
          `<div class="doc-firma"><div class="linea"></div>` +
            `${b.nombre ? `<div>${esc(b.nombre)}</div>` : ''}` +
            `${b.cargo ? `<div class="doc-muted">${esc(b.cargo)}</div>` : ''}</div>`,
        );
        break;
      case 'salto':
        out.push('<div class="salto"></div>');
        break;
    }
  }
  return out.join('\n');
}

function claseHtml(c?: ClaseP): string {
  if (!c) return '';
  if (c === 'right') return 'doc-right';
  if (c === 'center') return 'doc-center';
  if (c === 'muted') return 'doc-muted';
  return '';
}

function renderTablaHtml(filas: string[][], encabezado?: boolean): string {
  const filasHtml = filas.map((f, i) => {
    const celdas = f
      .map((c) => (encabezado && i === 0 ? `<th>${esc(c)}</th>` : `<td>${esc(c)}</td>`))
      .join('');
    return `<tr>${celdas}</tr>`;
  });
  return `<table>${filasHtml.join('')}</table>`;
}
