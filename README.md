# Resistor Divider Calculator | Custom Electronics Design & Development

Professional resistor divider calculator and documentation for a compact electronic design tool.

[Live Demo →](https://serbinov.github.io/Resistor-divider-calculator/)

---

## Overview

This project is a browser-based resistor divider calculator for designing two-resistor voltage dividers:
- `R1` upper resistor
- `R2` lower resistor
- output voltage: `Vout = Vin × R2 / (R1 + R2)`

It supports:
- automatic selection of standard resistor values from `E24`, `E96`, and generated `E192`
- manual resistor values entry
- known-resistor mode (`R1` or `R2` fixed)
- division ratio mode
- optional load resistor (`Rload`)
- power dissipation and package recommendation
- tolerance and temperature drift estimation using PPM

---

## Key Features

- Auto selection of optimal resistor pairs in a selectable range (default 1–100 kΩ)
- Manual mode for exact resistor values
- Single known resistor mode for computing the complementary resistor
- Division ratio mode for designing by ratio instead of fixed output voltage
- Standard resistor series support:
  - `E24` (5%)
  - `E96` (1%)
  - `E192` (0.5%, 0.25%, 0.1%)
- Load resistance impact calculation
- Power loss calculation for each resistor
- Recommended package size based on power and voltage
- Worst-case `Vout` variation from tolerance and temperature drift

---

## Usage

1. Open `index.html` in a browser.
2. Enter `Vin` and `Vout`.
3. Select the resistor tolerance/series.
4. Optionally enter `Rload`, `PPM` values, and resistor range.
5. Choose one of three modes:
   - `Auto Selection`
   - `Manual Input`
   - `Division Ratio`
6. Click **Calculate**.

The result block shows the best resistor combination, power losses, package recommendation, and worst-case output variation.

---

## Calculation Modes

- **Auto Selection**: searches standard resistor values and picks the best match.
- **Manual Input**: uses the exact values given for `R1` and `R2`.
- **Division Ratio**: computes missing voltage from a chosen ratio and known voltage.

---

## Technical Details

### Resistor Series

- `E24` — 5% tolerance
- `E96` — 1% tolerance
- `E192` — 0.5%, 0.25%, 0.1% tolerance

### Load and Power

- `Rload` is entered in kΩ and affects the effective lower resistor value.
- The app calculates power dissipation in each resistor and recommends a minimal package.

### Temperature Variation

- The calculator can estimate output variation using resistance temperature coefficient (`PPM`) for `R1` and `R2`.
- Results include minimum and maximum possible `Vout` across the temperature range.

---

## Project Structure

- `index.html` — main application and UI
- `js/divider.js` — reusable calculation module
- `__tests__/` — Jest unit tests for core functions
- `package.json` — project metadata and test script

---

## Notes for Developers

- The main logic is implemented in `js/divider.js`.
- `calculateDivider()` handles all modes and returns normalized results.
- `findClosestResistor()` selects nearest standard resistor values.
- `generateESeries()` builds the `E192` series.

---

## Russian Section / Русское описание

### Описание

Это веб-приложение для расчёта двухрезисторного делителя напряжения. Оно подбирает значения `R1` и `R2` для заданных `Vin` и `Vout`, поддерживает стандартные ряды резисторов и рассчитывает мощность, допуск и температурный дрейф.

### Возможности

- Автоматический подбор номиналов из `E24`, `E96`, `E192`
- Ручной ввод `R1` и `R2`
- Режим одного известного резистора
- Расчёт с учётом нагрузки (`Rload`)
- Оценка мощности и рекомендации по корпусу
- Оценка изменений `Vout` при допуске и температурном дрейфе

---

## Contact

**Oleg Serbinov**

📧 [serbinovoleg@gmail.com](mailto:serbinovoleg@gmail.com)
🌐 [https://serbinov.github.io/](https://serbinov.github.io/)

---

## License

© 2026 Oleg Serbinov. All rights reserved.
