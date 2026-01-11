const mod = require('../js/divider.cjs');

describe('ESeries generator', () => {
  test('generateESeries returns 192 unique normalized values for E192', () => {
    const { E192 } = mod;
    expect(Array.isArray(E192)).toBe(true);
    expect(E192.length).toBeGreaterThanOrEqual(192);
    // normalized values should be between 1 and 10
    for (const v of E192) {
      expect(v).toBeGreaterThanOrEqual(1.0);
      expect(v).toBeLessThan(10.0);
    }
  });

  test('E24 contains known values', () => {
    const { E24 } = mod;
    expect(E24).toContain(3.3);
    expect(E24).toContain(4.7);
  });

  test('E96 contains known value 9.76', () => {
    const { E96 } = mod;
    expect(E96).toContain(9.76);
  });
});

describe('findClosestResistor & series detection', () => {
  test('findClosestResistor picks 3.3k for 3300 with 5% tolerance', () => {
    const { findClosestResistor } = mod;
    const res = findClosestResistor(3300, '5');
    expect(Math.abs(res.value - 3300)).toBeLessThanOrEqual(10);
    expect(res.series).toBe('E24');
  });

  test('getSeriesForValue recognizes 1000 as E96 when tolerance=1', () => {
    const { getSeriesForValue } = mod;
    const s = getSeriesForValue(1000, '1');
    expect(s).toBe('E96');
  });

  test('formatResistorValue human readable', () => {
    const { formatResistorValue } = mod;
    expect(formatResistorValue(3300)).toBe('3.30 kΩ');
    expect(formatResistorValue(47)).toBe('47.00 Ω');
    expect(formatResistorValue(2200000)).toBe('2.20 MΩ');
  });
});
