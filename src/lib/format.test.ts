import { describe, expect, it } from 'vitest';
import { aniosDesde, cursoActual, fechaLarga, hoyISO, interpolar, sumarDiasHabiles } from './format';

describe('fechaLarga', () => {
  it('formatea fecha ISO en español', () => {
    expect(fechaLarga('2025-11-16')).toBe('16 de noviembre de 2025');
    expect(fechaLarga('2026-03-01')).toBe('1 de marzo de 2026');
  });
  it('devuelve cadena vacía si no hay fecha', () => {
    expect(fechaLarga(null)).toBe('');
    expect(fechaLarga(undefined)).toBe('');
    expect(fechaLarga('')).toBe('');
  });
});

describe('cursoActual', () => {
  it('cambia el 1 de agosto', () => {
    expect(cursoActual(new Date(2026, 0, 15))).toBe('2025/2026'); // enero → curso anterior
    expect(cursoActual(new Date(2026, 6, 31))).toBe('2025/2026'); // 31 julio → curso anterior
    expect(cursoActual(new Date(2026, 7, 1))).toBe('2026/2027'); // 1 agosto → nuevo curso
    expect(cursoActual(new Date(2026, 10, 16))).toBe('2026/2027');
  });
});

describe('hoyISO', () => {
  it('produce formato YYYY-MM-DD sin desfase horario', () => {
    expect(hoyISO(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(hoyISO(new Date(2026, 11, 31))).toBe('2026-12-31');
  });
});

describe('sumarDiasHabiles', () => {
  it('salta el fin de semana', () => {
    // 2025-11-14 es viernes: +1 hábil → lunes 17
    expect(sumarDiasHabiles('2025-11-14', 1)).toBe('2025-11-17');
    // 2025-11-17 lunes: +5 hábiles → lunes 24
    expect(sumarDiasHabiles('2025-11-17', 5)).toBe('2025-11-24');
  });
});

describe('aniosDesde', () => {
  it('calcula años completos', () => {
    expect(aniosDesde('2020-06-15', new Date(2026, 5, 14))).toBe(5);
    expect(aniosDesde('2020-06-15', new Date(2026, 5, 15))).toBe(6);
    expect(aniosDesde('2020-06-15', new Date(2026, 4, 1))).toBe(5);
  });
  it('devuelve 0 sin fecha', () => {
    expect(aniosDesde('', new Date())).toBe(0);
  });
});

describe('interpolar', () => {
  it('sustituye variables presentes y limpia las ausentes', () => {
    expect(interpolar('Hola {nombre}, curso {curso}', { nombre: 'Ana' })).toBe('Hola Ana, curso ');
  });
});
