export function power(base, exponent) { 
  let answer = 1;
  while (exponent > 0) {
    if (exponent & 1) {
      answer = answer * base;
      exponent--;
    }
    base = base * base;
    exponent = exponent / 2;
  }
  return answer;
}
