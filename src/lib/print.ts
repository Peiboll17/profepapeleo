import { hoyLarga } from './format';

/**
 * Imprime un documento HTML en un iframe oculto: el usuario elige
 * "Guardar como PDF" en el diálogo de impresión. Sin dependencias externas.
 */
export function imprimirHtml(titulo: string, cuerpoHtml: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) return;
  doc.open();
  doc.write(`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${escapeHtml(titulo)}</title>
<style>
  @page { size: A4; margin: 25mm; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 11.5pt;
    line-height: 1.55;
    color: #000;
    margin: 0;
  }
  h1 { font-size: 15pt; text-align: center; margin: 0 0 1.2em; }
  h2 { font-size: 13pt; margin: 1.4em 0 0.5em; }
  h3 { font-size: 12pt; margin: 1.1em 0 0.4em; }
  p { margin: 0 0 0.85em; text-align: justify; }
  ul, ol { margin: 0 0 0.9em 1.4em; }
  ul { list-style: disc; }
  ol { list-style: decimal; }
  li { margin-bottom: 0.3em; }
  table { width: 100%; border-collapse: collapse; margin: 0.6em 0 1em; font-size: 10.5pt; }
  th, td { border: 1px solid #444; padding: 4pt 6pt; text-align: left; vertical-align: top; }
  th { background: #efefef; }
  .doc-right { text-align: right; }
  .doc-center { text-align: center; }
  .doc-muted { color: #333; font-size: 10pt; }
  .doc-firma { margin-top: 3.5em; text-align: center; }
  .doc-firma .linea { width: 60%; margin: 3em auto 0.3em; border-top: 1px solid #000; }
  .salto { page-break-after: always; }
  @media print { .no-print { display: none; } }
</style>
</head>
<body>${cuerpoHtml}</body>
</html>`);
  doc.close();

  const lanzar = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      // Limpiar el iframe tras un margen prudencial
      window.setTimeout(() => iframe.remove(), 60_000);
    }
  };
  // Dar tiempo a que imagenes/fuentes carguen antes de imprimir
  if (doc.readyState === 'complete') window.setTimeout(lanzar, 150);
  else iframe.onload = () => window.setTimeout(lanzar, 150);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c,
  );
}

/** Bloque estándar de lugar y fecha al pie de un escrito */
export function bloqueFecha(localidad: string): string {
  const lugar = localidad || '___________';
  return `<p class="doc-right">${escapeHtml(lugar)}, ${hoyLarga()}</p>`;
}
