const { calculateDivider } = require('../js/divider.cjs');

describe('calculateDivider (manual/single/auto and division ratio)', () => {
  test('manual mode returns exact resistor values and correct Vout', () => {
    const res = calculateDivider({ vin: 5, voutDesired: 2.5, mode: 'manual', r1_manual_k: 10, r2_manual_k: 10, tolerance: 'all' });
    expect(res.r1).toBe(10000);
    expect(res.r2).toBe(10000);
    expect(Math.abs(res.voutActual - 2.5)).toBeLessThan(1e-9);
  });

  test('single mode with known R1 computes R2 to match desired Vout', () => {
    const res = calculateDivider({ vin: 5, voutDesired: 3.3, mode: 'single', knownPos: 'r1', knownValue: 10, tolerance: 'all' });
    // r1 = 10k -> r2 = r1 / targetRatio
    expect(res.r1).toBe(10000);
    expect(res.r2).toBeGreaterThan(0);
    expect(Math.abs(res.voutActual - 3.3)).toBeLessThan(1e-6);
  });

  test('auto mode produces reasonable match for 5V->3.3V', () => {
    const res = calculateDivider({ vin: 5, voutDesired: 3.3, mode: 'auto', minRk: 1, maxRk: 100, tolerance: 'all' });
    expect(res.r1).toBeGreaterThan(0);
    expect(res.r2).toBeGreaterThan(0);
    // ensure relative error is small (<5%)
    expect(res.relError).toBeLessThan(5);
  });

  test('division ratio mode computes Vout from Vin', () => {
    const res = calculateDivider({ vin: 5, voutDesired: null, mode: 'auto', use_div_ratio: true, division_ratio: 0.66, known_voltage: 'vin' });
    expect(res.voutActual).toBeDefined();
    expect(Math.abs(res.voutActual - (5*0.66))).toBeLessThan(0.1);
  });

  test('division ratio mode computes Vin from Vout', () => {
    const res = calculateDivider({ vin: null, voutDesired: 3.3, mode: 'auto', use_div_ratio: true, division_ratio: 0.66, known_voltage: 'vout' });
    expect(res.r1).toBeGreaterThan(0);
    expect(res.r2).toBeGreaterThan(0);
  });
});