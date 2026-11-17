import { useEffect, useRef, useState } from 'react';
import type { Bloque } from '../lib/doc';
import { renderHtml } from '../lib/doc';
import { imprimirHtml } from '../lib/print';
import { descargarDocx } from '../lib/docx';
import { nombreArchivo } from '../lib/download';
import { Btn } from './ui';

/** 210 mm en px a 96 dpi */
const ANCHO_PAPEL_PX = 794;

/**
 * Vista previa tipo papel A4 con barra de exportación.
 * El papel se escala dinámicamente al ancho de su contenedor
 * (ResizeObserver): nunca se corta por la derecha, en ningún tamaño.
 * PDF: diálogo de impresión del navegador (Guardar como PDF).
 * Word: .docx real editable.
 */
export function DocPreview({
  titulo,
  bloques,
  alGuardar,
  guardado,
}: {
  titulo: string;
  bloques: Bloque[];
  alGuardar?: () => void;
  guardado?: boolean;
}) {
  const [copiado, setCopiado] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(1);
  const [altura, setAltura] = useState<number | undefined>(undefined);
  const html = renderHtml(bloques);
  const archivo = nombreArchivo(titulo);

  useEffect(() => {
    const wrap = wrapRef.current;
    const paper = paperRef.current;
    if (!wrap || !paper) return;
    const actualizar = () => {
      const s = Math.min(1, wrap.clientWidth / ANCHO_PAPEL_PX);
      setEscala(s);
      // transform no afecta al layout: la altura visible es la real × escala
      setAltura(paper.offsetHeight * s);
    };
    actualizar();
    const ro = new ResizeObserver(actualizar);
    ro.observe(wrap);
    ro.observe(paper);
    return () => ro.disconnect();
  }, [bloques]);

  return (
    <div className="print-target">
      <div className="sticky top-0 z-10 mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur">
        <span className="ml-1 truncate text-sm font-semibold text-slate-600">{titulo}</span>
        <span className="grow" />
        <Btn pequeno onClick={() => imprimirHtml(titulo, html)}>
          🖨️ PDF
        </Btn>
        <Btn pequeno variante="secundario" onClick={() => descargarDocx(bloques, archivo)}>
          📝 Word
        </Btn>
        <Btn
          pequeno
          variante="secundario"
          onClick={() => {
            navigator.clipboard?.writeText(html.replace(/<[^>]+>/g, ''));
            setCopiado(true);
            window.setTimeout(() => setCopiado(false), 2000);
          }}
        >
          {copiado ? '✓ Copiado' : '📋 Texto'}
        </Btn>
        {alGuardar && (
          <Btn pequeno variante={guardado ? 'fantasma' : 'primario'} onClick={alGuardar}>
            {guardado ? '✓ Guardado' : '💾 Guardar'}
          </Btn>
        )}
      </div>
      <div ref={wrapRef} className="doc-scaler-wrap" style={{ height: altura }}>
        <div className="flex justify-center">
          <div
            ref={paperRef}
            className="doc-paper"
            style={{ transform: `scale(${escala})`, transformOrigin: 'top center' }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-slate-400">
        Vista previa orientativa. El PDF se genera con «Imprimir → Guardar como PDF»; el Word es totalmente editable.
      </p>
    </div>
  );
}
