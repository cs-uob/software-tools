Feature: Exponentiation works.
  Our power function should be able to calculate (integer) exponents.

  Scenario: 4 to the power of 7 is 16384.
    Given a base of 4
    When taking it to the power of 7
    Then the answer should be 16384.
