import type { Bloque } from './doc';
import { descargarBlob } from './download';

const FUENTE_DOC = 'Times New Roman';

type NodoDocx = import('docx').Paragraph | import('docx').Table;

/**
 * Exporta a .docx con la librería `docx` cargada bajo demanda
 * (dynamic import): el bundle principal no paga sus ~400 kB.
 */
export async function descargarDocx(bloques: Bloque[], nombreArchivo: string): Promise<void> {
  const docx = await import('docx');
  const {
    AlignmentType,
    BorderStyle,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
    WidthType,
  } = docx;

  const lineasRuns = (texto: string): { text: string; bold?: boolean; break?: number }[] => {
    const runs: { text: string; bold?: boolean; break?: number }[] = [];
    String(texto ?? '')
      .split('\n')
      .forEach((linea, i) => {
        if (i > 0) runs.push({ text: '', break: 1 });
        linea
          .split(/\*\*(.+?)\*\*/g)
          .forEach((s, j) => {
            if (s === '') return;
            runs.push({ text: s, bold: j % 2 === 1 });
          });
      });
    return runs;
  };

  const bloqueADocx = (b: Bloque): NodoDocx[] => {
    switch (b.t) {
      case 'h1':
        return [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [new TextRun({ text: b.texto, bold: true, size: 30, font: FUENTE_DOC })],
          }),
        ];
      case 'h2':
        return [
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [new TextRun({ text: b.texto, bold: true, size: 26, font: FUENTE_DOC })],
          }),
        ];
      case 'h3':
        return [
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: b.texto, bold: true, size: 24, font: FUENTE_DOC })],
          }),
        ];
      case 'p': {
        const runs = lineasRuns(b.texto);
        const alineacion =
          b.clase === 'right'
            ? AlignmentType.RIGHT
            : b.clase === 'center'
              ? AlignmentType.CENTER
              : AlignmentType.JUSTIFIED;
        const estilo = b.clase === 'muted' ? { size: 20, color: '333333' } : {};
        return [
          new Paragraph({
            alignment: alineacion,
            spacing: { after: 160 },
            children: runs.map((r) => new TextRun({ ...r, ...estilo, font: FUENTE_DOC })),
          }),
        ];
      }
      case 'ul':
        return b.items.map(
          (i) =>
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60 },
              children: lineasRuns(i).map((r) => new TextRun({ ...r, font: FUENTE_DOC })),
            }),
        );
      case 'ol':
        return b.items.map(
          (i, n) =>
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({ text: `${n + 1}. `, font: FUENTE_DOC }),
                ...lineasRuns(i).map((r) => new TextRun({ ...r, font: FUENTE_DOC })),
              ],
            }),
        );
      case 'tabla': {
        const filas = b.filas.map(
          (f, i) =>
            new TableRow({
              tableHeader: b.encabezado && i === 0,
              children: f.map(
                (c) =>
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: c,
                            bold: b.encabezado && i === 0,
                            size: 21,
                            font: FUENTE_DOC,
                          }),
                        ],
                      }),
                    ],
                    margins: { top: 60, bottom: 60, left: 80, right: 80 },
                  }),
              ),
            }),
        );
        return [new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: filas })];
      }
      case 'firma': {
        return [
          new Paragraph({ spacing: { before: 720 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 1 } },
            children: [
              new TextRun({
                text: b.nombre ?? 'Firma del/de la solicitante',
                font: FUENTE_DOC,
              }),
            ],
          }),
          ...(b.cargo
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: b.cargo, size: 20, color: '333333', font: FUENTE_DOC })],
                }),
              ]
            : []),
        ];
      }
      case 'salto':
        return [new Paragraph({ pageBreakBefore: true })];
    }
  };

  const hijos: NodoDocx[] = [];
  for (const b of bloques) hijos.push(...bloqueADocx(b));

  const document = new Document({
    styles: {
      default: {
        document: { run: { font: FUENTE_DOC, size: 23 } }, // 11.5pt
      },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 1417, bottom: 1417, left: 1417, right: 1417 } }, // 25mm
        },
        children: hijos,
      },
    ],
  });

  const blob = await Packer.toBlob(document);
  descargarBlob(blob, `${nombreArchivo}.docx`);
}
