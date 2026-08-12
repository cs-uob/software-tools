import { power } from "../../power.js";

import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';

Given('a base of {int}', function (int) {
  this.base = int
});

When('taking it to the power of {int}', function (int) {
  this.exponent = int
});

Then('the answer should be {int}.', function (int) {
  this.answer = int
  assert.strictEqual(power(this.base,this.exponent),this.answer);
});
