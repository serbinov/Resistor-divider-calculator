#!/usr/bin/env python3
"""
Tests for resistor_divider module
"""

import unittest
from resistor_divider import calculate_output_voltage, calculate_r1, calculate_r2


class TestResistorDivider(unittest.TestCase):
    """Test cases for resistor divider calculator functions"""
    
    def test_calculate_output_voltage_equal_resistors(self):
        """Test output voltage with equal resistors (should be half input)"""
        result = calculate_output_voltage(12, 1000, 1000)
        self.assertAlmostEqual(result, 6.0, places=6)
    
    def test_calculate_output_voltage_different_resistors(self):
        """Test output voltage with different resistors"""
        # 12V input, R1=2k, R2=1k -> Vout = 12 * (1000/3000) = 4V
        result = calculate_output_voltage(12, 2000, 1000)
        self.assertAlmostEqual(result, 4.0, places=6)
    
    def test_calculate_output_voltage_3to1_ratio(self):
        """Test with 3:1 voltage divider"""
        # R1=3k, R2=1k -> Vout = Vin * 0.25
        result = calculate_output_voltage(5, 3000, 1000)
        self.assertAlmostEqual(result, 1.25, places=6)
    
    def test_calculate_output_voltage_negative_resistor(self):
        """Test that negative resistor raises ValueError"""
        with self.assertRaises(ValueError):
            calculate_output_voltage(12, -1000, 1000)
        
        with self.assertRaises(ValueError):
            calculate_output_voltage(12, 1000, -1000)
    
    def test_calculate_r2(self):
        """Test R2 calculation"""
        # Vin=12V, Vout=6V, R1=1000 -> R2=1000
        result = calculate_r2(12, 6, 1000)
        self.assertAlmostEqual(result, 1000.0, places=6)
    
    def test_calculate_r2_quarter_voltage(self):
        """Test R2 calculation for 1/4 output voltage"""
        # Vin=12V, Vout=3V, R1=3000 -> R2=1000
        result = calculate_r2(12, 3, 3000)
        self.assertAlmostEqual(result, 1000.0, places=6)
    
    def test_calculate_r2_invalid_vout(self):
        """Test that invalid Vout raises ValueError"""
        with self.assertRaises(ValueError):
            calculate_r2(12, 15, 1000)  # Vout > Vin
        
        with self.assertRaises(ValueError):
            calculate_r2(12, -1, 1000)  # Vout negative
    
    def test_calculate_r1(self):
        """Test R1 calculation"""
        # Vin=12V, Vout=6V, R2=1000 -> R1=1000
        result = calculate_r1(12, 6, 1000)
        self.assertAlmostEqual(result, 1000.0, places=6)
    
    def test_calculate_r1_quarter_voltage(self):
        """Test R1 calculation for 1/4 output voltage"""
        # Vin=12V, Vout=3V, R2=1000 -> R1=3000
        result = calculate_r1(12, 3, 1000)
        self.assertAlmostEqual(result, 3000.0, places=6)
    
    def test_calculate_r1_invalid_vout(self):
        """Test that invalid Vout raises ValueError"""
        with self.assertRaises(ValueError):
            calculate_r1(12, 15, 1000)  # Vout > Vin
        
        with self.assertRaises(ValueError):
            calculate_r1(12, -1, 1000)  # Vout negative
    
    def test_roundtrip_calculation(self):
        """Test that calculating R2 and then Vout gives original values"""
        vin = 9
        vout_desired = 3.3
        r1 = 2200
        
        # Calculate R2
        r2 = calculate_r2(vin, vout_desired, r1)
        
        # Calculate Vout with calculated R2
        vout_actual = calculate_output_voltage(vin, r1, r2)
        
        self.assertAlmostEqual(vout_actual, vout_desired, places=6)


if __name__ == '__main__':
    unittest.main()
