# Building by Testing


## Installing Unity

We are going to install a unit testing framework for C projects called
[Unity](https://www.throwtheswitch.org/unity). Please note this is not the same
thing as the (much more famous) [Unity game engine](https://unity.com/). 

We will be building and installing this software, so you will need to carry
these steps out on a machine where you have administrative privileges. The
instructions are written for your Vagrant VM. 

Unity is open-source, so we can clone the repository directly from GitHub.

```bash
 git clone https://github.com/ThrowTheSwitch/Unity.git
```

Once you have cloned the repository, it is time to build and install the
software. We can do this using the `cmake` build tool, which should already
exist on your system.

```bash 
cd Unity
sudo cmake --install .
```

You will see CMake's output, telling you where it has installed certain files in
your filesystem. This includes header files and the Unity library itself.

You should no longer need the `Unity` source repository -- you can delete it if
you want. The repository does contain documentation in the `docs` folder, but
you may find this easier to read [as rendered on GitHub](https://github.com/ThrowTheSwitch/Unity/blob/master/docs/UnityGettingStartedGuide.md).


## A Test Test

Create a new folder somewhere (i.e., don't do the rest of this exercise inside
the `Unity` source directory), and call it something like 'calculator'. Then,
inside that folder we are going to create two `.c` files. 

The first, `calc.c`, is going to be the library you are developing. You can
start this file with the below content:

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}
```

The second, `test.c`, is going to contain your test suite. For the moment this
should look like the below:

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

Once you have prepared both files, test that you can build your tests by running
the following:

```bash
gcc -I /usr/local/include/unity/ -o tests test.c -l unity
```

If this completes without error, you should then be able to run `./tests` and
see the following output:

```
test.c:13:test_add:PASS

-----------------------
1 Tests 0 Failures 0 Ignored 
OK
```

Read and understand what has happened here. You built a test executable that contains
one test, `test_add`, that made use of the `add` function from your main code.
You can now start developing additional tests using the framework. 

Note: the `-I` part of the `gcc` command above is telling the compiler where to
find the `unity.h` header file. You will be recompiling your tests often in this
lab. To avoid retyping this, you can set an environment variable. If you run:

```bash
export CPATH=/usr/local/include/unity/
```

Then you should be able to compile your tests with just:

```bash
gcc -o tests test.c -l unity
```

If you want to compile and run your tests in one line, you can chain the
commands:

```bash
gcc -o tests test.c -l unity; ./tests
```


## Testing for Development

You are now going to develop a simple calculator library using a test-driven
development workflow, writing tests first as you go. 

The basic test-driven workflow is this:

1. You think of something your code should do (a new feature, or how an edge
   case should be handled, etc.)
2. You write one test in your test suite that checks for the behaviour you want.
   You run your test suite and confirm that this test currently _fails_. (RED)
3. You implement the desired behaviour in the simplest manner that would satisfy the
   test. You run your tests and confirm that your code passes the test. (GREEN)
4. You smooth the rough edges from your implementation -- make it more
   efficient, or better integrated into the rest of your code. After doing this,
you rerun your test suite to confirm that _all_ tests are still passing, and you
didn't break any other desired behaviour while making your changes. (REFACTOR)

The idea is to move rapidly through this cycle, which forces you to decompose
problems and think about what the _desired output_ of your code really is,
_before_ you start implementing it.  The test suite you build up serves as
documentation of your intentions and checks that you haven't later broken
anything you wanted your code to do.

_A simple example_: Write a new test function, `test_sub`, in `test.c`, that
would test the basic functionality of a `sub` function that subtracts two
numbers.  Invoke your new test in the same way `test_add` works. If you try to
build your tests now, you will find this fails because the function doesn't even
exist.  Directly copy your `add` function in `calc.c` and rename the copied
function `sub`, then build and run your tests.  You should see something like
this:

```
test.c:17:test_add:PASS
test.c:8:test_sub:FAIL: Expected 0 Was 2

-----------------------
2 Tests 1 Failures 0 Ignored 
FAIL
```

Your test suite is now failing rather than passing, because `sub` is adding
rather than subtracting (RED). Fix the subtraction in your code and you should
see your tests return to passing (GREEN). You would now refactor, but in this
particular case the code is already very simple, so there is nothing to do, and
you can move on to the next desired behaviour.

_A less simple example_: Tests often cover tricky edge cases. Here's one: what
should our `add` function do when we ask it to add a number to `INT_MAX`, the
largest number that can be represented in the `int` data type?

This is a design decision with no obvious answer. Should it just return
`INT_MAX`?  Should it return a negative integer?  Should it do something else?
Whatever you decide it _should_ do, write a case for this within `test_add` as a
new ASSERT.  Check what the status of your test is, and then move on to
implementing the change you designed. 

### The Specification

Part of any development workflow is moving from a high-level specification --
which doesn't give all the details -- to code that makes an interpretation of
the desired functionality.  This is still true of test-driven development, the
only difference is you are writing parts of the specification as tests before
you write their implementation.

Here is the high-level specification for your calculator library:

> The calculator contains functions for adding, subtracting, multiplying,
> dividing and exponentiating numbers, both as floats and as integers. The
> calculator also contains a `calculate` function that accepts a string
> representation of an expression (like '2 * 2' or '4.2 + 9.1') and returns the
> correct result as a string. 

Using the test-driven development workflow, iterate your way towards
implementing this specification. You may need to refer to the [Unity Reference
for Assertions](https://github.com/ThrowTheSwitch/Unity/blob/master/docs/UnityAssertionsReference.md) or the [Cheat Sheet](https://github.com/ThrowTheSwitch/Unity/blob/master/docs/UnityAssertionsCheatSheetSuitableforPrintingandPossiblyFraming.pdf).

Once you have both a test suite covering everything you want your code to do and
a working implementation that passes your tests, try to expand your _test
coverage_ by thinking about the range of possible inputs and how your system
should handle them. Think about large numbers, small numbers, invalid
operations and strange characters in strings.  You may find that asking other
people to suggest inputs is a good way to discover cases you hadn't considered.
