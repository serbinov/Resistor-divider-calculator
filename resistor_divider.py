#!/usr/bin/env python3
"""
Resistor Divider Calculator

This module provides functions to calculate voltage divider circuits.
A voltage divider is a passive linear circuit that produces an output voltage
that is a fraction of its input voltage.

Formula: Vout = Vin * (R2 / (R1 + R2))

Where:
    Vin  = Input voltage
    Vout = Output voltage
    R1   = Resistor connected between Vin and Vout
    R2   = Resistor connected between Vout and ground
"""


def calculate_output_voltage(vin, r1, r2):
    """
    Calculate the output voltage of a resistor divider.
    
    Args:
        vin (float): Input voltage in volts
        r1 (float): First resistor value in ohms (connected to input)
        r2 (float): Second resistor value in ohms (connected to ground)
    
    Returns:
        float: Output voltage in volts
    
    Raises:
        ValueError: If resistor values are not positive or if R1 + R2 = 0
    
    Example:
        >>> calculate_output_voltage(12, 1000, 1000)
        6.0
    """
    if r1 <= 0 or r2 <= 0:
        raise ValueError("Resistor values must be positive")
    
    if r1 + r2 == 0:
        raise ValueError("Sum of resistors cannot be zero")
    
    vout = vin * (r2 / (r1 + r2))
    return vout


def calculate_r2(vin, vout, r1):
    """
    Calculate R2 given input voltage, output voltage, and R1.
    
    Args:
        vin (float): Input voltage in volts
        vout (float): Desired output voltage in volts
        r1 (float): First resistor value in ohms
    
    Returns:
        float: Required R2 value in ohms
    
    Raises:
        ValueError: If parameters are invalid
    
    Example:
        >>> calculate_r2(12, 6, 1000)
        1000.0
    """
    if r1 <= 0:
        raise ValueError("R1 must be positive")
    
    if vin <= 0:
        raise ValueError("Input voltage must be positive")
    
    if vout <= 0 or vout >= vin:
        raise ValueError("Output voltage must be positive and less than input voltage")
    
    # From Vout = Vin * (R2 / (R1 + R2))
    # Vout * (R1 + R2) = Vin * R2
    # Vout * R1 + Vout * R2 = Vin * R2
    # Vout * R1 = Vin * R2 - Vout * R2
    # Vout * R1 = R2 * (Vin - Vout)
    # R2 = (Vout * R1) / (Vin - Vout)
    
    r2 = (vout * r1) / (vin - vout)
    return r2


def calculate_r1(vin, vout, r2):
    """
    Calculate R1 given input voltage, output voltage, and R2.
    
    Args:
        vin (float): Input voltage in volts
        vout (float): Desired output voltage in volts
        r2 (float): Second resistor value in ohms
    
    Returns:
        float: Required R1 value in ohms
    
    Raises:
        ValueError: If parameters are invalid
    
    Example:
        >>> calculate_r1(12, 6, 1000)
        1000.0
    """
    if r2 <= 0:
        raise ValueError("R2 must be positive")
    
    if vin <= 0:
        raise ValueError("Input voltage must be positive")
    
    if vout <= 0 or vout >= vin:
        raise ValueError("Output voltage must be positive and less than input voltage")
    
    # From Vout = Vin * (R2 / (R1 + R2))
    # Vout * (R1 + R2) = Vin * R2
    # Vout * R1 + Vout * R2 = Vin * R2
    # Vout * R1 = Vin * R2 - Vout * R2
    # Vout * R1 = R2 * (Vin - Vout)
    # R1 = (R2 * (Vin - Vout)) / Vout
    
    r1 = (r2 * (vin - vout)) / vout
    return r1


def main():
    """
    Command-line interface for the resistor divider calculator.
    """
    print("=== Resistor Divider Calculator ===")
    print()
    print("Choose calculation mode:")
    print("1. Calculate output voltage (given Vin, R1, R2)")
    print("2. Calculate R2 (given Vin, Vout, R1)")
    print("3. Calculate R1 (given Vin, Vout, R2)")
    print()
    
    try:
        choice = input("Enter your choice (1-3): ").strip()
        
        if choice == '1':
            vin = float(input("Enter input voltage (V): "))
            r1 = float(input("Enter R1 value (Ω): "))
            r2 = float(input("Enter R2 value (Ω): "))
            
            vout = calculate_output_voltage(vin, r1, r2)
            print(f"\nOutput voltage: {vout:.4f} V")
            print(f"Voltage division ratio: {vout/vin:.4f} ({vout/vin*100:.2f}%)")
            
        elif choice == '2':
            vin = float(input("Enter input voltage (V): "))
            vout = float(input("Enter desired output voltage (V): "))
            r1 = float(input("Enter R1 value (Ω): "))
            
            r2 = calculate_r2(vin, vout, r1)
            print(f"\nRequired R2: {r2:.2f} Ω")
            
            # Verify
            actual_vout = calculate_output_voltage(vin, r1, r2)
            print(f"Verification - Actual Vout: {actual_vout:.4f} V")
            
        elif choice == '3':
            vin = float(input("Enter input voltage (V): "))
            vout = float(input("Enter desired output voltage (V): "))
            r2 = float(input("Enter R2 value (Ω): "))
            
            r1 = calculate_r1(vin, vout, r2)
            print(f"\nRequired R1: {r1:.2f} Ω")
            
            # Verify
            actual_vout = calculate_output_voltage(vin, r1, r2)
            print(f"Verification - Actual Vout: {actual_vout:.4f} V")
            
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")
            
    except ValueError as e:
        print(f"\nError: {e}")
    except KeyboardInterrupt:
        print("\n\nExiting...")


if __name__ == "__main__":
    main()
