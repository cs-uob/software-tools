import pytest

def power(base, exponent):
    assert(exponent >= 0)
    if exponent == 0:
         return 1
    if exponent == 1:
         return base
    if exponent & 1 == 1:
         return base * power(base*base, (exponent-1)//2)

class TestPower:
    def test_knowngood(self):
        assert power(4,7) == 16384

    def test_knownerror(self):
        with pytest.raises(AssertionError):
            power(2,-3)
