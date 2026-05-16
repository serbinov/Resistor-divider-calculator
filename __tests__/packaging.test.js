const mod = require('../js/divider.cjs');

describe('Packaging recommendations and voltage-aware checks', () => {
  test('Small power & low voltage recommends small SMD (0201)', () => {
    const res = mod.calculateDivider({ vin: 5, voutDesired: 2.5, mode: 'manual', r1_manual_k: 10, r2_manual_k: 10, tolerance: 'all' });
    const r1Voltage = 5 - res.voutActual; // voltage across R1
    const recs = mod.getRecommendedPackageSize(res.powerR1, r1Voltage, res.r1);
    expect(recs && recs[0]).toMatch(/0201/);
  });

  test('High voltage across resistor selects higher voltage package', () => {
    // create a high-voltage divider: Vin 300V, want Vout 5V, pick R ratio
    const res = mod.calculateDivider({ vin: 300, voutDesired: 5, mode: 'auto', minRk: 1, maxRk: 1000, tolerance: 'all' });
    const r1Voltage = 300 - res.voutActual;
    const recs = mod.getRecommendedPackageSize(res.powerR1, r1Voltage, res.r1);
    // expect not to pick tiny packages with low voltage rating
    expect(recs && recs[0]).not.toMatch(/0201|0402/);
  });

  test('Power calculation for R2 uses Vout^2/R2', () => {
    const res = mod.calculateDivider({ vin: 12, voutDesired: 3, mode: 'manual', r1_manual_k: 10, r2_manual_k: 2.5, tolerance: 'all' });
    const expectedP2 = Math.pow(res.voutActual, 2) / res.r2;
    expect(res.powerR2).toBeCloseTo(expectedP2, 9);
  });
});
