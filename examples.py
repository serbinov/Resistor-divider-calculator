#!/usr/bin/env python3
"""
Example usage of the resistor divider calculator
"""

from resistor_divider import calculate_output_voltage, calculate_r1, calculate_r2


def print_divider():
    """Print a visual divider"""
    print("-" * 60)


def example_1():
    """Example: Calculate output voltage with equal resistors"""
    print("\nExample 1: Equal resistors (50% voltage divider)")
    print_divider()
    
    vin = 12
    r1 = 1000
    r2 = 1000
    
    vout = calculate_output_voltage(vin, r1, r2)
    
    print(f"Input:  Vin = {vin}V, R1 = {r1}Ω, R2 = {r2}Ω")
    print(f"Output: Vout = {vout}V ({vout/vin*100:.1f}% of input)")


def example_2():
    """Example: Step down 5V to 3.3V for microcontroller"""
    print("\nExample 2: 5V to 3.3V for microcontroller")
    print_divider()
    
    vin = 5.0
    vout_desired = 3.3
    r2 = 1000  # Choose a common value
    
    r1 = calculate_r1(vin, vout_desired, r2)
    
    print(f"Input:  Vin = {vin}V, Desired Vout = {vout_desired}V, R2 = {r2}Ω")
    print(f"Output: Required R1 = {r1:.2f}Ω")
    print(f"Note:   Use standard 510Ω resistor (closest standard value)")
    
    # Verify with standard value
    r1_standard = 510
    vout_actual = calculate_output_voltage(vin, r1_standard, r2)
    print(f"Verify: With R1 = {r1_standard}Ω, actual Vout = {vout_actual:.3f}V")


def example_3():
    """Example: Battery voltage monitoring"""
    print("\nExample 3: Monitor 12V battery with 5V ADC")
    print_divider()
    
    vin = 12.0
    vout_max = 5.0  # ADC max voltage
    r1 = 7000
    
    r2 = calculate_r2(vin, vout_max, r1)
    
    print(f"Input:  Vin = {vin}V, Max ADC = {vout_max}V, R1 = {r1}Ω")
    print(f"Output: Required R2 = {r2:.2f}Ω")
    print(f"Note:   Use standard 5.1kΩ resistor")
    
    # Show voltage readings
    print("\nBattery voltage to ADC voltage mapping:")
    for battery_v in [10, 11, 12, 13, 14]:
        adc_v = calculate_output_voltage(battery_v, r1, r2)
        print(f"  Battery: {battery_v:2d}V → ADC reads: {adc_v:.3f}V")


def example_4():
    """Example: Quarter voltage divider"""
    print("\nExample 4: Reduce signal to 25% (1:3 ratio)")
    print_divider()
    
    vin = 10.0
    vout_desired = 2.5
    r2 = 1000
    
    r1 = calculate_r1(vin, vout_desired, r2)
    
    print(f"Input:  Vin = {vin}V, Desired Vout = {vout_desired}V, R2 = {r2}Ω")
    print(f"Output: Required R1 = {r1:.2f}Ω")
    print(f"Ratio:  R1:R2 = {r1/r2:.1f}:1")


def main():
    """Run all examples"""
    print("=" * 60)
    print("Resistor Divider Calculator - Example Usage")
    print("=" * 60)
    
    example_1()
    example_2()
    example_3()
    example_4()
    
    print("\n" + "=" * 60)
    print("All examples completed!")
    print("=" * 60)


if __name__ == "__main__":
    main()
