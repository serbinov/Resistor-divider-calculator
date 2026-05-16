const mod = require('../js/divider.cjs');

describe('Boundary limits and extreme values', () => {
  test('manual high Vin computes powers correctly', () => {
    const vin = 5000; // V
    const res = mod.calculateDivider({ vin, voutDesired: 50, mode: 'manual', r1_manual_k: 1000, r2_manual_k: 10 });
    const r1 = 1000 * 1000; // 1000 k -> 1,000,000 Ω
    const r2 = 10 * 1000; // 10 k -> 10,000 Ω
    const r2_effective = r2;
    const dividerCurrentExact = vin / (r1 + r2_effective);
    const expectedP1 = Math.pow(dividerCurrentExact, 2) * r1;
    const expectedP2 = Math.pow(Number(res.voutActual), 2) / r2;

    expect(res.dividerCurrentExact).toBeCloseTo(dividerCurrentExact, 6);
    expect(res.powerR1).toBeCloseTo(expectedP1, 6);
    expect(res.powerR2).toBeCloseTo(expectedP2, 6);
  });

  test('zero or negative Vin throws', () => {
    expect(() => mod.calculateDivider({ vin: 0, voutDesired: 1, mode: 'manual', r1_manual_k: 1, r2_manual_k: 1 })).toThrow();
    expect(() => mod.calculateDivider({ vin: -5, voutDesired: 1, mode: 'manual', r1_manual_k: 1, r2_manual_k: 1 })).toThrow();
  });

  test('very small resistances produce high power (check magnitude)', () => {
    const vin = 12;
    const res = mod.calculateDivider({ vin, voutDesired: 6, mode: 'manual', r1_manual_k: 0.001, r2_manual_k: 0.001 });
    // r1 = 1 Ω, r2 = 1 Ω -> I = 12 / 2 = 6 A, P1 = I^2 * R1 = 36 W
    expect(res.powerR1).toBeGreaterThan(30);
    expect(res.powerR2).toBeGreaterThan(30);
  });

  test('getRecommendedPackageSize suggests high-voltage for >200V', () => {
    const recs = mod.getRecommendedPackageSize(0.001, 300, 1000);
    expect(recs.some(r => /Consider high-voltage rated resistors/.test(r))).toBeTruthy();
  });
});
