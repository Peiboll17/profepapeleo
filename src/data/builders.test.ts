import { describe, expect, it } from 'vitest';
import type { Perfil } from '../store/perfil';
import { CCAA, ccaaPorId, decretoCurriculo, marcoNormativoCcaa } from './ccaa';
import { TRAMITES, tramitePorId } from './tramites';
import { SEMILLAS, construirProgramacion, defectosProgramacion, semillaPorId, semillasPorEtapa } from './programacion';
import { construirActa, construirCentroDoc, defectosActa, defectosCentroDoc } from './centro';

const perfilFalso: Perfil = {
  nombre: 'Ana',
  apellidos: 'García López',
  dni: '12345678X',
  ccaa: 'madrid',
  cuerpo: 'Cuerpo de Profesores de Enseñanza Secundaria',
  especialidad: 'Matemáticas',
  centro: 'IES Ejemplo',
  codCentro: '28000000',
  localidad: 'Madrid',
  provincia: 'Madrid',
  email: 'ana@example.es',
  telefono: '600000000',
  fechaNombramiento: '2010-09-01',
  regimen: 'publico',
  funcionario: true,
};

const ctx = { perfil: perfilFalso, ccaa: undefined };

describe('tramites', () => {
  it('hay definiciones con id único', () => {
    const ids = TRAMITES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(tramitePorId('asuntos-propios')).toBeDefined();
  });

  it('cada trámite genera bloques a partir de sus defectos', () => {
    for (const t of TRAMITES) {
      const datos: Record<string, string> = {};
      t.defectos?.(ctx);
      for (const paso of t.pasos)
        for (const c of paso.campos) {
          if (c.tipo === 'info') continue;
          datos[c.id] = c.defecto !== undefined ? String(c.defecto) : '2025-03-10';
        }
      const { titulo, bloques } = t.construir(datos, ctx);
      expect(titulo.length).toBeGreaterThan(0);
      expect(bloques.length).toBeGreaterThan(3);
    }
  });

  it('asuntos propios calcula la fecha de fin', () => {
    const t = tramitePorId('asuntos-propios')!;
    const { bloques } = t.construir({ fechaInicio: '2025-03-01', dias: '5' }, ctx);
    const texto = JSON.stringify(bloques);
    expect(texto).toContain('5 días naturales');
    expect(texto).toContain('5 de marzo de 2025');
  });

  it('el escrito incluye los datos del interesado', () => {
    const t = tramitePorId('instancia')!;
    const { bloques } = t.construir({ asunto: 'Prueba', expone: 'Hechos.', solicita: 'Petición.' }, ctx);
    const texto = JSON.stringify(bloques);
    expect(texto).toContain('Ana García López');
    expect(texto).toContain('IES Ejemplo');
  });
});

describe('programacion', () => {
  it('los defectos interpolan materia y curso sin restos de plantilla', () => {
    const d = defectosProgramacion({ perfil: perfilFalso });
    expect(d.introduccion).toContain('1º ESO');
    expect(d.introduccion).not.toContain('{curso}');
    expect(d.competenciasTexto.length).toBeGreaterThan(50);
  });

  it('el documento incluye las 13 secciones', () => {
    const d = defectosProgramacion({ perfil: perfilFalso });
    const { titulo, bloques } = construirProgramacion(d, { perfil: perfilFalso });
    expect(titulo).toContain('Matemáticas');
    const texto = JSON.stringify(bloques);
    for (const seccion of ['1. Introducción', '5. Competencias específicas', '8. Atención a la diversidad', '13. Actividades complementarias'])
      expect(texto).toContain(seccion);
    expect(bloques.some((b) => b.t === 'tabla')).toBe(true);
  });
});

describe('normativa por CCAA', () => {
  it('los decretos de currículo existen para las CCAA verificadas', () => {
    expect(decretoCurriculo(ccaaPorId('andalucia'), 'eso')).toContain('102/2023');
    expect(decretoCurriculo(ccaaPorId('madrid'), 'primaria')).toContain('61/2022');
    expect(decretoCurriculo(ccaaPorId('valencia'), 'eso')).toContain('107/2022');
    expect(decretoCurriculo(ccaaPorId('galicia'), 'bachillerato')).toContain('157/2022');
    expect(decretoCurriculo(ccaaPorId('catalunya'), 'eso')).toContain('175/2022');
  });

  it('Cataluña usa el decreto de educación básica para primaria y ESO', () => {
    expect(decretoCurriculo(ccaaPorId('catalunya'), 'primaria')).toContain('175/2022');
    expect(decretoCurriculo(ccaaPorId('catalunya'), 'bachillerato')).toContain('176/2022');
  });

  it('las CCAA sin normativa usan marcadores [Completar]', () => {
    const linea = decretoCurriculo(undefined, 'eso');
    expect(linea).toContain('[Completar');
  });

  it('Ceuta y Melilla: gestión ministerial, sin decreto autonómico', () => {
    const linea = decretoCurriculo(ccaaPorId('ceuta'), 'eso');
    expect(linea).toContain('reales decretos estatales');
    expect(linea).not.toContain('[Completar');
  });

  it('todas las CCAA con competencia educativa tienen decreto de currículo para las 3 etapas', () => {
    for (const c of CCAA) {
      if (c.id === 'ceuta' || c.id === 'melilla') continue;
      const cur = c.normativa?.curriculo;
      // Cataluña y Euskadi usan un decreto único de "educación básica" para primaria + ESO
      expect(cur?.primaria ?? cur?.basica, `${c.id}: primaria`).toBeTruthy();
      expect(cur?.eso ?? cur?.basica, `${c.id}: eso`).toBeTruthy();
      expect(cur?.bachillerato, `${c.id}: bachillerato`).toBeTruthy();
    }
  });

  it('decretos verificados de la segunda pasada de CCAA', () => {
    expect(decretoCurriculo(ccaaPorId('aragon'), 'eso')).toContain('ECD/853/2022');
    expect(decretoCurriculo(ccaaPorId('asturias'), 'primaria')).toContain('57/2022');
    expect(decretoCurriculo(ccaaPorId('baleares'), 'eso')).toContain('42/2025');
    expect(decretoCurriculo(ccaaPorId('cantabria'), 'bachillerato')).toContain('73/2022');
    expect(decretoCurriculo(ccaaPorId('extremadura'), 'eso')).toContain('110/2022');
    expect(decretoCurriculo(ccaaPorId('cyl'), 'eso')).toContain('39/2022');
    expect(decretoCurriculo(ccaaPorId('murcia'), 'bachillerato')).toContain('251/2022');
    expect(decretoCurriculo(ccaaPorId('navarra'), 'eso')).toContain('71/2022');
    expect(decretoCurriculo(ccaaPorId('euskadi'), 'primaria')).toContain('77/2023');
    expect(decretoCurriculo(ccaaPorId('rioja'), 'primaria')).toContain('41/2022');
    expect(decretoCurriculo(ccaaPorId('clm'), 'eso')).toContain('82/2022');
    expect(decretoCurriculo(ccaaPorId('canarias'), 'eso')).toContain('30/2023');
  });

  it('el marco normativo incluye LOMLOE, RD estatal, decreto autonómico y orden de evaluación', () => {
    const marco = marcoNormativoCcaa(ccaaPorId('valencia'), 'eso').join(' ');
    expect(marco).toContain('LOMLOE');
    expect(marco).toContain('217/2022');
    expect(marco).toContain('107/2022');
    expect(marco).toContain('19/2023');
  });

  it('asuntos propios precarga la norma de permisos autonómica', () => {
    const defectos = tramitePorId('asuntos-propios')!.defectos?.({ perfil: perfilFalso, ccaa: ccaaPorId('galicia') });
    expect(defectos?.refLegal).toContain('Orden de 29 de enero de 2016');
  });

  it('sexenios precarga la convocatoria autonómica', () => {
    const defectos = tramitePorId('sexenios')!.defectos?.({ perfil: perfilFalso, ccaa: ccaaPorId('clm') });
    expect(defectos?.refLegal).toContain('EDU/1051/2021');
  });

  it('la instancia propone el registro electrónico de la CCAA', () => {
    const defectos = tramitePorId('instancia')!.defectos?.({ perfil: perfilFalso, ccaa: ccaaPorId('madrid') });
    expect(defectos?.viaRegistro).toContain('sede.madrid.org');
  });

  it('la programación usa el decreto de la CCAA del perfil', () => {
    const d = defectosProgramacion({ perfil: { ...perfilFalso, ccaa: 'madrid' } });
    expect(d.marcoNormativo).toContain('Decreto 65/2022');
    expect(d.marcoNormativo).toContain('−');
  });
});

describe('centro', () => {
  it('catálogo ampliado: cobertura por etapa y semillas válidas', () => {
    expect(semillasPorEtapa('eso')).toHaveLength(11);
    expect(semillasPorEtapa('primaria')).toHaveLength(7);
    expect(semillasPorEtapa('bachillerato')).toHaveLength(6);
    expect(semillasPorEtapa('infantil')).toHaveLength(3);
    expect(semillasPorEtapa('fp')).toHaveLength(2);
    const ids = SEMILLAS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SEMILLAS) {
      expect(s.nombre.length, s.id).toBeGreaterThan(0);
      expect(s.competencias.length, s.id).toBeGreaterThanOrEqual(2);
      expect(s.saberes.length, s.id).toBeGreaterThanOrEqual(2);
      expect(s.cursos.length, s.id).toBeGreaterThanOrEqual(1);
    }
  });

  it('bachillerato genera su documento con semilla propia', () => {
    const s = semillaPorId('mat-bach')!;
    const base = defectosProgramacion({ perfil: perfilFalso });
    const doc = construirProgramacion(
      {
        ...base,
        etapa: 'bachillerato',
        semillaId: s.id,
        materia: s.nombre,
        curso: s.cursos[0],
        competenciasTexto: s.competencias.join('\n'),
        saberesTexto: s.saberes.map((b) => `${b.bloque}: ${b.resumen}`).join('\n'),
      },
      { perfil: perfilFalso },
    );
    expect(JSON.stringify(doc.bloques)).toContain('Bachillerato');
    expect(JSON.stringify(doc.bloques)).toContain('Análisis');
  });

  it('infantil tiene las tres áreas del RD 95/2022 como semillas', () => {
    const semillas = semillasPorEtapa('infantil');
    expect(semillas.length).toBe(3);
    expect(semillas[0].nombre).toContain('Crecimiento en Armonía');
    expect(semillas[1].nombre).toContain('Comunicación y Representación');
    expect(semillas[2].nombre).toContain('Descubrimiento y Exploración');
    expect(semillas[0].cursos).toContain('3 años');
  });

  it('la programación soporta infantil y fp', () => {
    const base = defectosProgramacion({ perfil: perfilFalso });
    const inf = construirProgramacion(
      { ...base, etapa: 'infantil', semillaId: 'otra', materia: 'Educación Infantil', curso: '3 años' },
      { perfil: perfilFalso },
    );
    expect(JSON.stringify(inf.bloques)).toContain('Educación Infantil');

    const fp = construirProgramacion(
      { ...base, etapa: 'fp', semillaId: 'otra', materia: 'Desarrollo de Aplicaciones Web', curso: '1º DAW' },
      { perfil: perfilFalso },
    );
    const textoFp = JSON.stringify(fp.bloques);
    expect(textoFp).toContain('Formación Profesional');
    expect(textoFp).toContain('Resultados de aprendizaje');
  });

  it('marco normativo específico de infantil y fp', () => {
    const inf = marcoNormativoCcaa(ccaaPorId('madrid'), 'infantil').join(' ');
    expect(inf).toContain('95/2022'); // RD de ordenación de infantil
    expect(inf).toContain('[Completar'); // currículo autonómico de infantil sin verificar

    const fp = marcoNormativoCcaa(undefined, 'fp').join(' ');
    expect(fp).toContain('3/2022'); // LO 3/2022 de FP
    expect(fp).toContain('659/2023'); // RD de ordenación del sistema de FP
  });

  it('el acta incluye orden del día, acuerdos y firmas', () => {
    const d = { ...defectosActa(), asistentes: 'Luis Pérez — Director\nMaría Ruiz — Secretaria', acuerdos: 'Aprobar la PGA\nRevisar horarios' };
    const { titulo, bloques } = construirActa(d, perfilFalso);
    expect(titulo).toContain('Acta');
    const texto = JSON.stringify(bloques);
    expect(texto).toContain('Orden del día');
    expect(texto).toContain('Luis Pérez — Director');
    expect(texto).toContain('Aprobar la PGA');
  });

  it('la PGA y la memoria tienen sus secciones propias', () => {
    const pga = construirCentroDoc(defectosCentroDoc(perfilFalso, 'pga'), perfilFalso);
    expect(JSON.stringify(pga.bloques)).toContain('3. Objetivos prioritarios del curso');
    expect(JSON.stringify(pga.bloques)).toContain('14. Calendario del curso');

    const mem = construirCentroDoc(defectosCentroDoc(perfilFalso, 'memoria'), perfilFalso);
    expect(JSON.stringify(mem.bloques)).toContain('Propuestas de mejora');
    expect(mem.titulo).toContain('Memoria');
  });
});
