# Resistor Divider Calculator

A Python tool for calculating voltage divider circuits using resistors.

## Overview

A resistor divider (also called a voltage divider) is a passive linear circuit that produces an output voltage that is a fraction of its input voltage. It consists of two resistors in series:

```
Vin ----[R1]----+----[R2]---- GND
                |
               Vout
```

The output voltage is calculated using the formula:

```
Vout = Vin × (R2 / (R1 + R2))
```

## Features

This calculator can:
1. **Calculate output voltage** - Given input voltage and both resistor values
2. **Calculate R2** - Given input voltage, desired output voltage, and R1
3. **Calculate R1** - Given input voltage, desired output voltage, and R2

## Installation

No installation required! Just clone this repository:

```bash
git clone https://github.com/serbinov/Resistor-divider-calculator.git
cd Resistor-divider-calculator
```

## Usage

### Command-Line Interface

Run the calculator interactively:

```bash
python3 resistor_divider.py
```

You'll be presented with three calculation modes:

#### Mode 1: Calculate Output Voltage
Given an input voltage and both resistor values, calculate the output voltage.

**Example:**
```
Input: Vin = 12V, R1 = 1000Ω, R2 = 1000Ω
Output: Vout = 6.0000 V (50.00%)
```

#### Mode 2: Calculate R2
Given an input voltage, desired output voltage, and R1, calculate the required R2.

**Example:**
```
Input: Vin = 12V, Vout = 5V, R1 = 2000Ω
Output: R2 = 1428.57 Ω
```

#### Mode 3: Calculate R1
Given an input voltage, desired output voltage, and R2, calculate the required R1.

**Example:**
```
Input: Vin = 12V, Vout = 3V, R2 = 1000Ω
Output: R1 = 3000.00 Ω
```

### Python Module

You can also import and use the functions in your own Python code:

```python
from resistor_divider import calculate_output_voltage, calculate_r1, calculate_r2

# Calculate output voltage
vout = calculate_output_voltage(vin=12, r1=1000, r2=1000)
print(f"Output voltage: {vout}V")  # Output: 6.0V

# Calculate required R2
r2 = calculate_r2(vin=12, vout=5, r1=2000)
print(f"Required R2: {r2}Ω")  # Output: 1428.57Ω

# Calculate required R1
r1 = calculate_r1(vin=12, vout=3, r2=1000)
print(f"Required R1: {r1}Ω")  # Output: 3000.0Ω
```

## Testing

Run the test suite:

```bash
python3 test_resistor_divider.py -v
```

## Common Use Cases

### Step-down voltage for microcontrollers
Convert 5V to 3.3V for a microcontroller:
- Vin = 5V, Vout = 3.3V
- If R2 = 1000Ω, then R1 = 515.15Ω (use 510Ω standard value)

### Battery voltage monitoring
Monitor a 12V battery using a 5V ADC:
- Vin = 12V, Vout = 5V
- If R1 = 7000Ω, then R2 = 5000Ω

### Signal level shifting
Reduce a 10V signal to 2V:
- Vin = 10V, Vout = 2V
- If R2 = 1000Ω, then R1 = 4000Ω

## Important Notes

- The output voltage must be less than the input voltage
- Both resistor values must be positive
- This calculator assumes ideal resistors (no tolerance)
- Consider the current draw and power dissipation in your circuit
- For high-precision applications, use resistors with low tolerance values

## License

This project is open source and available for educational and practical use.
