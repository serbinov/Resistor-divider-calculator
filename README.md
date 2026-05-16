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

- **Auto Selection**: the calculator generates candidate `R2` values from the selected resistor series and search range, calculates the required `R1` for each candidate, snaps `R1` to the nearest standard resistor, and chooses the pair with the lowest output error.
- **Manual Input**: the calculator uses the exact values entered for `R1` and `R2`, then computes `Vout`, error, current, and power dissipation.
- **Division Ratio**: the calculator computes the missing voltage from the chosen ratio and known voltage, then finds the best standard resistor pair for the resulting ratio.

---

## How It Works

### Core calculation

The calculator uses the basic voltage divider formula:

- `Vout = Vin × R2 / (R1 + R2)`

For a desired output voltage, the ideal resistor ratio is:

- `R1/R2 = (Vin/Vout) - 1`

When a standard resistor series is selected, the app searches for values that satisfy this ratio while staying within the specified resistor range.

### Auto mode algorithm

1. Convert the minimum and maximum resistor range from kΩ to ohms.
2. Generate candidate `R2` values from the selected standard series and decades.
3. For each `R2` candidate, compute the ideal `R1` value.
4. Snap `R1` to the closest available standard resistor.
5. Evaluate the resulting `Vout` with or without load.
6. Compute absolute and relative error, divider current, and power dissipation.
7. Choose the best candidate by error and display the top combinations.

### Known resistor mode

- If `R1` is fixed, the calculator computes `R2 = R1 / ((Vin/Vout) - 1)`.
- If `R2` is fixed, it computes `R1 = R2 × ((Vin/Vout) - 1)`.
- The app then checks whether the computed resistor is a standard value and reports the closest match.

### Manual mode

- Uses the exact entered values for `R1` and `R2`.
- Computes actual output voltage from `Vin` and the divider.
- Displays whether the provided resistors produce the expected `Vout`.

### Division ratio mode

- If `Vin` is known, `Vout = Vin × ratio`.
- If `Vout` is known, `Vin = Vout / ratio`.
- The calculator then performs an auto selection for the resulting voltage pair.

### Load impact

- When `Rload` is entered, the effective lower resistor becomes `R2 || Rload`.
- The app applies the parallel resistor formula:

  - `R2_effective = 1 / (1/R2 + 1/Rload)`

- The resulting loaded output voltage is used for error and power calculations.

### Power and package recommendations

- Divider current is computed as:
  - `I = Vout / (R1 + R2_effective)`
- Power in each resistor is:
  - `P_R1 = I^2 × R1`
  - `P_R2 = I^2 × R2`
- Recommended package size is selected from common SMD and through-hole options based on estimated power and voltage.

### Tolerance and temperature drift

- The calculator supports tolerance selection for common resistor series.
- It also accepts `PPM` values for `R1` and `R2` to estimate temperature drift.
- Worst-case output variation is calculated using resistor tolerance plus temperature coefficient across the range from -40°C to +85°C.

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

## Contact

**Oleg Serbinov**

📧 [serbinovoleg@gmail.com](mailto:serbinovoleg@gmail.com)
🌐 [https://serbinov.github.io/](https://serbinov.github.io/)

---

## License

© 2026 Oleg Serbinov. All rights reserved.
