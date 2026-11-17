import { describe, expect, it } from 'vitest';
import { esc, parrafos, renderHtml, textoHtml, type Bloque } from './doc';

describe('esc', () => {
  it('escapa HTML peligroso', () => {
    expect(esc('<script>"x"&</script>')).toBe('&lt;script&gt;&quot;x&quot;&amp;&lt;/script&gt;');
  });
});

describe('textoHtml', () => {
  it('convierte **negritas** y escapa el resto', () => {
    expect(textoHtml('por **5 días naturales** y <tag>')).toBe('por <b>5 días naturales</b> y &lt;tag&gt;');
  });
});

describe('parrafos', () => {
  it('divide por líneas en blanco y elimina vacíos', () => {
    expect(parrafos('Uno.\n\nDos.\n\n\n')).toEqual([
      { t: 'p', texto: 'Uno.' },
      { t: 'p', texto: 'Dos.' },
    ]);
  });
});

describe('renderHtml', () => {
  const bloques: Bloque[] = [
    { t: 'h1', texto: 'Título' },
    { t: 'p', texto: 'Párrafo con <negrita> y "comillas"', clase: 'muted' },
    { t: 'ul', items: ['A', 'B'] },
    { t: 'ol', items: ['Uno'] },
    { t: 'tabla', encabezado: true, filas: [['K', 'V'], ['a', 'b']] },
    { t: 'firma', nombre: 'Ana García', cargo: 'Secretaria' },
    { t: 'salto' },
  ];

  it('renderiza todos los tipos de bloque con escape', () => {
    const html = renderHtml(bloques);
    expect(html).toContain('<h1>Título</h1>');
    expect(html).toContain('&lt;negrita&gt;');
    expect(html).toContain('&quot;comillas&quot;');
    expect(html).toContain('<ul><li>A</li><li>B</li></ul>');
    expect(html).toContain('<ol><li>Uno</li></ol>');
    expect(html).toContain('<table>');
    expect(html).toContain('<th>K</th>');
    expect(html).toContain('doc-firma');
    expect(html).toContain('class="salto"');
    expect(html).toContain('doc-muted');
  });
});
