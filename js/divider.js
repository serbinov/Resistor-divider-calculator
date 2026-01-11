// Core functions extracted for unit testing
export const E24 = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];

export const E96 = [1.00,1.02,1.05,1.07,1.10,1.13,1.15,1.18,1.21,1.24,1.27,1.30,1.33,1.37,1.40,1.43,1.47,1.50,1.54,1.58,1.62,1.65,1.69,1.74,1.78,1.82,1.87,1.91,1.96,2.00,2.05,2.10,2.15,2.21,2.26,2.32,2.37,2.43,2.49,2.55,2.61,2.67,2.74,2.80,2.87,2.94,3.01,3.09,3.16,3.24,3.32,3.40,3.48,3.57,3.65,3.74,3.83,3.92,4.02,4.12,4.22,4.32,4.42,4.53,4.64,4.75,4.87,4.99,5.11,5.23,5.36,5.49,5.62,5.76,5.90,6.04,6.19,6.34,6.49,6.65,6.81,6.98,7.15,7.32,7.50,7.68,7.87,8.06,8.25,8.45,8.66,8.87,9.09,9.31,9.53,9.76];

export function generateESeries(m, sig=3) {
  const arr = [];
  for (let n = 0; n < m; n++) {
    const v = Math.pow(10, n / m);
    const rounded = Number(v.toPrecision(sig));
    arr.push(rounded);
  }
  // unique normalized values rounded to 3 decimals
  return Array.from(new Set(arr.map(x => Number(x.toFixed(3))))).sort((a,b)=>a-b);
}

export const E192 = generateESeries(192, 3);

export function getSeriesForValue(value, tolerance) {
  const checkSeries = (seriesArr, seriesName) => {
    const decade = Math.pow(10, Math.floor(Math.log10(value)));
    const normalized = value / decade;
    return seriesArr.some(x => Math.abs(x - normalized) < 0.001) ? seriesName : null;
  };

  if (tolerance === 'all') {
    return checkSeries(E192,'E192') || checkSeries(E96, 'E96') || checkSeries(E24, 'E24') || null;
  } else if (tolerance === '0.5' || tolerance === '0.25' || tolerance === '0.1') {
    return checkSeries(E192,'E192') || null;
  } else if (tolerance === '1') {
    return checkSeries(E96, 'E96') || null;
  } else {
    return checkSeries(E24, 'E24') || null;
  }
}

export function findClosestResistor(value, tolerance) {
  const searchInSeries = (seriesArr, seriesName) => {
    let decade = Math.pow(10, Math.floor(Math.log10(value)));
    const normalized = value / decade;
    let closest = seriesArr[0];
    let minDiff = Math.abs(normalized - closest);
    for (const r of seriesArr) {
      const diff = Math.abs(normalized - r);
      if (diff < minDiff) {
        minDiff = diff;
        closest = r;
      }
    }
    if (normalized > 9.5 && closest < 1.5) {
      decade *= 10;
    }
    return { value: closest * decade, series: seriesName, diff: Math.abs(closest * decade - value) };
  };

  if (tolerance === 'all') {
    const cand192 = searchInSeries(E192, 'E192');
    const cand96 = searchInSeries(E96, 'E96');
    const cand24 = searchInSeries(E24, 'E24');
    let best = cand192;
    if (cand96.diff < best.diff) best = cand96;
    if (cand24.diff < best.diff) best = cand24;
    return { value: best.value, series: best.series };
  } else if (tolerance === '0.5' || tolerance === '0.25' || tolerance === '0.1') {
    const c = searchInSeries(E192, 'E192');
    return { value: c.value, series: c.series };
  } else if (tolerance === '1') {
    const c = searchInSeries(E96, 'E96');
    return { value: c.value, series: c.series };
  } else {
    const c = searchInSeries(E24, 'E24');
    return { value: c.value, series: c.series };
  }
}

export function formatResistorValue(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)} MΩ`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} kΩ`;
  } else {
    return `${value.toFixed(2)} Ω`;
  }
}

// calculateDivider: testable core of the UI's calculateResistors
export function calculateDivider({
  vin, voutDesired, mode='auto', minRk=1, maxRk=100, rloadk='', tolerance='all', allowCombos=false, knownPos='r1', knownValue=0, r1_manual_k=0, r2_manual_k=0, use_div_ratio=false, division_ratio=null, known_voltage='vin'
} = {}) {
  // If division ratio mode is used, compute missing voltage from ratio
  if (use_div_ratio) {
    if (typeof division_ratio !== 'number' || division_ratio <= 0 || division_ratio >= 1) throw new Error('Invalid division ratio');
    if (known_voltage === 'vin') {
      if (typeof vin !== 'number' || vin <= 0) throw new Error('Invalid Vin');
      voutDesired = +(vin * division_ratio).toFixed(8);
    } else {
      if (typeof voutDesired !== 'number' || voutDesired <= 0) throw new Error('Invalid Vout');
      vin = +(voutDesired / division_ratio).toFixed(8);
    }
  }

  if (typeof vin !== 'number' || typeof voutDesired !== 'number' || voutDesired <= 0 || vin <= 0) {
    throw new Error('Invalid voltages');
  }
  const targetRatio = (vin / voutDesired) - 1; // R1/R2

  const rload = (rloadk === '' || rloadk === undefined || rloadk === null) ? Infinity : (Number(rloadk) * 1000);
  const useLoad = Number.isFinite(rload) && !isNaN(rload) && rload > 0;

  let r1 = 0, r2 = 0, r1Series = null, r2Series = null;

  if (mode === 'manual') {
    r1 = Number(r1_manual_k) * 1000;
    r2 = Number(r2_manual_k) * 1000;
    r1Series = getSeriesForValue(r1, tolerance);
    r2Series = getSeriesForValue(r2, tolerance);
  } else if (mode === 'single') {
    const known = Number(knownValue) * 1000;
    if (isNaN(known) || known <= 0) throw new Error('Invalid known resistor');
    if (knownPos === 'r1') {
      r1 = known;
      r2 = r1 / targetRatio;
    } else {
      r2 = known;
      r1 = r2 * targetRatio;
    }
    r1Series = getSeriesForValue(r1, tolerance);
    r2Series = getSeriesForValue(r2, tolerance);
  } else {
    // auto: search standard series within the specified min/max range and collect candidates
    // minRk/maxRk are in kΩ
    const minR = minRk * 1000;
    const maxR = maxRk * 1000;
    const seriesList = [];
    if (tolerance === '1') seriesList.push({arr: E96, name: 'E96'});
    else if (tolerance === '5') seriesList.push({arr: E24, name: 'E24'});
    else if (tolerance === '0.5' || tolerance === '0.25' || tolerance === '0.1') seriesList.push({arr: E192, name: 'E192'});
    else if (tolerance === 'all') { seriesList.push({arr: E192, name: 'E192'}); seriesList.push({arr: E96, name: 'E96'}); seriesList.push({arr: E24, name: 'E24'}); }
    else { seriesList.push({arr: E96, name: 'E96'}); seriesList.push({arr: E24, name: 'E24'}); }

    const candidates = [];
    for (let decade = Math.pow(10, Math.floor(Math.log10(minR))); decade <= maxR*10; decade *= 10) {
      for (const seriesObj of seriesList) {
        for (const value of seriesObj.arr) {
          const r2Candidate = value * decade;
          if (r2Candidate < minR || r2Candidate > maxR) continue;
          const r1Candidate = r2Candidate * targetRatio;
          if (r1Candidate < minR || r1Candidate > maxR) continue;
          const r1StdObj = findClosestResistor(r1Candidate, tolerance);
          const r1Val = r1StdObj.value;
          const r1SeriesName = r1StdObj.series || seriesObj.name;
          const unloadedVout = vin * (r2Candidate / (r1Val + r2Candidate));
          let effectiveR2 = r2Candidate;
          if (useLoad) effectiveR2 = 1 / (1 / r2Candidate + 1 / rload);
          const loadedVout = vin * (effectiveR2 / (r1Val + effectiveR2));
          const actualVout = useLoad ? loadedVout : unloadedVout;
          const error = Math.abs(actualVout - voutDesired);
          const relError = error / voutDesired * 100;
          const totalResistanceCandidate = r1Val + effectiveR2;
          const dividerCurrentCandidate = actualVout / totalResistanceCandidate;
          const powerR1Candidate = Math.pow(dividerCurrentCandidate, 2) * r1Val;
          const powerR2Candidate = Math.pow(dividerCurrentCandidate, 2) * r2Candidate;
          const loadCurrentCandidate = useLoad ? (loadedVout / rload) : 0;
          candidates.push({
            r1: r1Val,
            r2: r2Candidate,
            r1Series: r1SeriesName,
            r2Series: seriesObj.name,
            unloadedVout,
            actualVout,
            absError: error,
            relError,
            dividerCurrent: dividerCurrentCandidate,
            powerR1: powerR1Candidate,
            powerR2: powerR2Candidate,
            loadCurrent: loadCurrentCandidate
          });
        }
      }
    }
    // sort by absolute error then relative
    candidates.sort((a,b) => a.absError - b.absError || a.relError - b.relError);
    const topCandidates = candidates.slice(0, 10);
    // store for rendering (safe in both browser and Node)
    if (typeof window !== 'undefined') window._lastCandidates = topCandidates; else globalThis._lastCandidates = topCandidates;
    if (topCandidates.length === 0) {
      throw new Error('No candidates');
    }
    const best = topCandidates[0];
    r1 = best.r1;
    r2 = best.r2;
    r1Series = best.r1Series;
    r2Series = best.r2Series;
  }

  const r2_effective = useLoad ? 1 / (1 / r2 + 1 / rload) : r2;
  const voutActual = vin * (r2_effective / (r1 + r2_effective));
  // Round main calculations to 4 decimal places for display
  const voutActualR = +(voutActual).toFixed(4);
  const absError = +(Math.abs(voutActual - voutDesired)).toFixed(4);
  const relError = +((absError / voutDesired) * 100).toFixed(4);
  const divisionCoeff = +(r2 / (r1 + r2)).toFixed(6);
  const totalResistance = r1 + r2_effective;
  const dividerCurrent = totalResistance > 0 ? +(voutActual / totalResistance).toFixed(4) : 0;
  const powerR1 = +Math.pow(dividerCurrent, 2) * r1;
  const powerR2 = +Math.pow(dividerCurrent, 2) * r2;

  return {
    r1, r2, r1Series, r2Series, voutActual: voutActualR, absError, relError, dividerCurrent, powerR1, powerR2, divisionCoeff
  };
}
