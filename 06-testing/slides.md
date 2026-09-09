# Software Tools
(COMS10012 / COMSM0085)

## Week 6: Testing
(or, "How to fail repeatedly and like it")
  - Making Assertions 
  - Unit Testing 
  - Test-Driven Development
  - Property Testing
  - Fuzzing
  - Formal Verification


---

## But first...

Confusion about Git workflows?


---

## Testing 

A very simple question: _Does your code do what it is supposed to do?_

Programs usually operate on certain inputs and produce some desired behaviour
(outputs). So we can rephrase: for all valid inputs, does your code produce the
intended outputs?

Raises two questions:
   - What are the valid inputs?
   - What behaviour do you expect for those inputs?

Most problems unearthed in testing stem from the programmer _not knowing the answer_ to these questions with enough specificity.


---

## Testing: A parable

> I want my function `mean` to return the mean of an array of ints.

vs

> I want my function `mean` to return the mean of an array of ints, expressed as
> a float.

vs

> I want my function `mean` to return the mean of an array of ints, expressed as
> a float. When the sum of the input array of ints is larger than INT_MAX, the
> result should...

---

## Making Assertions

Assertions are mechanisms for making a logical statement about variables in your
program. You insert them to express what _should_ be true about values of
variables. 

An example you've seen before:

```c

static void add_mime_mapping(const char *extension, const char *mimetype) {
    size_t i;
    assert(strlen(extension) > 0);
    assert(strlen(mimetype) > 0);
```

For C, `#include <assert.h>` to get the `assert()` macro.

You say _"It is true that the length of the string `extension` here is > 0."_

Benefits:
   - You feel comforted by saying things that are obviously true.
   - The assertion does absolutely nothing.
   - Positive thinking.
   - You believe in your code.
   - You are a successful and very handsome programmer.


... but...

---

## Failing Assertions

... what if, somehow, `strlen(extension) == 0`?

Drawbacks:
   - You are totally humiliated.
   - Absolutely devastating.
   - Your program immediately kills itself out of shame.


You can think of an `assert` as essentially:

```
assert(assertion){
     if (! assertion){
        complain();
        exit(1);
     }
}
```

(This is not literally the implementation).

Also: assertions can be entirely removed by the compiler with the `-DNDEBUG=1`
option. This avoids assertion failures crashing your production code. (But
doesn't do anything for the logic the assertions were guarding).

---

## When to Assert Yourself

Assertions are useful for testing your assumptions while writing your code. They
have access to the internal state of your program at runtime, and can test
statements at different stages of execution. They can help you discover
and reason about errors in your logic.

But they are embedded _within_ your code, so can be hard to review (are you
testing the right things?).  They don't always answer the question of whether
your code is _producing the right behaviour_, just that certain assumptions are
not being violated.

What we often want is an _external_ perspective on our code. For each of the
interfaces our code offers, does calling that interface with an input produce
the desired result? Does it do what your documentation says it should?

These are the questions that users of your code will care about.

For this we want _unit tests_.

---

## Unit Testing

Unit tests run your code against a set of inputs, comparing the actual result of
running the code to what you declare the result _should_ be.

There are frameworks to make this easier in many languages. Some even try to
help generate tests for you.

If any test fails, your current version of the code is broken, and you need to
fix it so the tests pass. If the code was passing all of the tests before you
started work, and isn't passing all of the tests after you finished work, you
have introduced a **regression** and your teammates will be annoyed.

Writing good unit tests can be a skill -- _quality assurance_ teams focus on
this.

---

## Unit Testing: Example in Unity

`calc.c`
 
```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}
```

`test.c`

```c
#include "unity.h"
#include "calc.c"

void setUp(void) {}     // Not needed yet
void tearDown(void) {}

void test_add(void) {
    TEST_ASSERT_EQUAL(4, add(2, 2));
}

int main(void) {
    UNITY_BEGIN();
    RUN_TEST(test_add);
    return UNITY_END();
}
```
---

## When to Write Tests

A typical development process:
  1. Write some code.
  2. Write tests for that code.
  3. Occasionally remember to run the tests.

This is a bad idea. You have _already implemented things the wrong way_ by the time you
write the test.

Instead _test-driven development_ suggests you:
  1. Write tests for the behaviour you want.
  2. Write code that passes the tests.

We hope to convince you this is better.

---
## Test-Driven Development

More specifically, the TDD workflow follows what is known as the
'RED-GREEN-REFACTOR' model.

First, you pick a single specific behaviour you want your code to have (e.g., something in the spec, an edge case you want to cover, a bug you want to fix). Then you iterate through:

##### RED
 Write a single test for what the output should be for a given input. Run your tests and confirm that you **currently fail** this test. 

##### GREEN
In your codebase, introduce the simplest change that would cause your code to  pass the test. Run your tests and confirm that you pass the test. 

##### REFACTOR
 Now (tricky) make your code _good_ while making sure that _all_ tests are still passing. 


Once refactored, you can go back around to select a new behaviour you want to
implement, but **keeping the tests** from previous passes through the cycle. 

You gradually build up a **test suite** that checks all of your edits to the
codebase against your previous decisions about what _should_ happen.

Importantly: writing the tests first forces you to think about your design
before you start hacking away at implementation. 


---
## Property Testing

_What behaviour do you expect?_ can be spot-tested for certain inputs.

But the space of possible inputs is usually large. Did we miss an input that
would lead to broken behaviour?

- What if we randomly generate lots of inputs? (We would need to pre-compute the outputs)
- What if we just test that _specific properties_ hold for a range of possible inputs? (e.g, we want to be sure that `a` times `b` is always equal to `b` times `a` (commutativity))

Even without knowing the exact outputs for specific inputs, we should usually be
able to express properties the outputs should have relative to the inputs.

---

## Property Testing: QuickCheck

Popular testing framework QuickCheck (originally for Haskell).

```c
#include "quickcheck4c.h"

QCC_TestStatus mulCommutativity(QCC_GenValue **vals, int len, QCC_Stamp **stamp) {
  int a = *QCC_getValue(vals, 0, int*);
  int b = *QCC_getValue(vals, 1, int*);

  return a*b == b*a;
}

int main(int argc, char **argv) {
  QCC_init(0);
  QCC_testForAll(100, 1000, mulCommutativity, 2, QCC_genInt, QCC_genInt);
}
```

---

## Fuzzing

Random input generation is an excellent way to discover bugs in code.

If you randomly generate inputs against someone's code, you can often make it crash.

This can be... interesting.

Often the first step to discovering a vulnerability is uncovering 'interesting'
behaviour in response to an input.
 - A logical path through the code that isn't _meant_ to be accessed this way.
 - A value the programmer thought should never be possible.
 - Maybe this means a state can be accessed that is meant to be protected?

Fuzzers are programs that attempt to break other programs. They generate
_demented_ input values to stress-test the designers' assumptions,
attempting to find all possible routes through the conditionals in a program.
   
---

## Evading the Fuzz 

How do we protect our code against deranged input generators?

- You are not more inventive than fuzz tool authors.
- These people are crazy.
- The AFL fuzzer taught itself the JPEG specification through trial and error.
  [The original input was
'hello'](https://lcamtuf.blogspot.com/2014/11/pulling-jpegs-out-of-thin-air.html).

Being 'very careful' is not enough. Everyone thinks they've been very careful until
someone finds a way to deliver a null pointer deep inside your JSON parser.

You need to do better than not being able to think of a way this could go wrong.

You need to be able to **prove** that this **cannot** go wrong.

---

## Formal methods

To mathematically prove something is to reach the highest standards of epistemic certainty about it.

The vast majority of scientific knowledge does not meet this standard.

Very few technical systems have formal verification of their behaviour.

Reasoning mathematically about _programs in general_ is essentially impossible.

Even mathematically modelling only specific properties of certain programs working with closely-delimited inputs is **HARD**.

(There are a few people in the School that can do this). 

(I am not one of them).

---

## Formal verification

Given enough effort, formal verification *is* possible.
 - You can prove that desirable properties of your program will always hold, under specified conditions.
 - This is very desirable for certain types of high-stakes software.

There are tools to help you construct proofs.

[Lean](https://lean4.dev/) is a programming language and a proof assistant,
designed to enable you to write formally-verified code -- part of the process of
writing your software is proving its correctness. 

---

## This week

Our focus is on getting you to work on:
   - Writing unit tests for your code
   - Using a test-driven development workflow
   - Automating your usage of tests

These tools are directly useful to you now (outside of this unit). 

Property testing frameworks, fuzzing and formal methods may be important tools
for you in the future. 

---

### The End

We'll see you in the labs on Friday.

