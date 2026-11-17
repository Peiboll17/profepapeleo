# ProfePapeleo

App web que elimina el papeleo del docente en España: genera trámites administrativos (permisos, licencias, sexenios), programaciones didácticas LOMLOE por etapa y comunidad autónoma, y documentos de centro (actas, PGA, memoria).

**100 % cliente**: sin backend, los datos viven en el navegador (localStorage). La IA generativa es opcional (BYOK, clave propia del usuario).

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5174
npm run test       # vitest
npm run build      # build de producción
npm run build:pages  # build para GitHub Pages (base /profepapeleo/ + fallback SPA)
```

## Despliegue

GitHub Pages mediante el workflow de Actions (`.github/workflows/deploy.yml`): cada push a `main` construye y publica en `https://peiboll17.github.io/profepapeleo/`. En el repo: Settings → Pages → Source: *GitHub Actions*.

## Arquitectura

- Vite + React 19 + TypeScript + Tailwind v4
- Estado: zustand con persist (perfil, ajustes, historial)
- Modelo neutro de documentos `Bloque[]` (`src/lib/doc.ts`) con renderizado HTML (preview/PDF) y DOCX (`docx`)
- Asistentes declarativos definidos en `src/data/` (trámites, programaciones, documentos de centro)
- Normativa educativa precargada por comunidad autónoma (`src/data/ccaa.ts`), verificada con fuentes oficiales
