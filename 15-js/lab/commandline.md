# Commandline JavaScript

JavaScript is an interpeted language often used on the web. Most web browsers
contain a JavaScript interpreter, but this isn't the only way to encounter the
language.

To understand JavaScript as a language on its own, before we place it in the
context of a webpage, we'll be using JavaScript in a commandline interpreter
first.

Install the required JavaScript engine on Vagrant with `sudo apt-get install
nodejs`

You can then start the interpreter with `node`.

## Basic operations

The traditional first program:

```js
console.log('Hello, world');
```

Note that as well as printing out the string you supplied, the interpreter will
also print (in slightly different text) `undefined`. This is the _return value_
of the `log` function you just called. This function doesn't return anything, it
just causes side-effects (in this case, text is printed to the console).

`log` is just one of several functions provided by the `console` object. Several
of them (`debug`,`info`,`warn`,`error`) perform essentially the same function,
printing to the console, but do so under different categories of logging. Your 
interpreter console won't differentiate between them, but your browser's console
might.

JavaScript has all the usual arithmetic operations:

```js
10012+85
10012-85
10012/85
10012*85
10012**85
```

Note with the last value that JavaScript is claiming that the result is
infinite -- this is because numbers greater than 1.797693134862315E+308 are
beyond what can be represented by the floating point number type. If you attempt
a smaller exponentiation like `3**2` you should get the expected result. You can
also create `Infinity` through a division by 0, and it's possible to create a
`-Infinity` (figure out how). Note also that `Infinity` can be used in
calculations, to some extent. Try a few operations with it.

A few basic data structures: first, the array,

```js 
list = []
list.push(6)
list.push(4)
list.push(5)
list.sort()
list
```

Note that `.sort` did not just return the list in sorted form, but altered the
list order.  Procedures in JS often have side-effects. If you wanted to just
create a sorted copy without sorting the original, you could use `.toSorted`. To
see all the available procedures in node, type the identifier with a dot
(`list.`) and then tab twice. One you commonly might use is `.includes`, which tells
you if an array contains a value. A useful trick if you want to remove a specific
value from an array is to find the index of the item with `.indexOf` and then
call (`.splice(index, 1)`). Note the difference between what this method returns 
and the effect it has on the original array.

Now let's look at objects.

```js 
obj = {}
obj['name']  = 'John Smith'
obj['age']   = 32
obj['likes'] = ['javascript', 'heavy metal', 'spiders']

obn = {
"systemName" : "PersonTracker",
"function"   : "surveillance", 
"target"     : obj
}
```

Note that you'll have to paste the full definition of `obn` at once, rather than
entering it line-by-line. Take a look at the structure of `obn` in your console. 
This is an object with another object (`obj`) as one of its properties.

Alter `obj` by changing John's age to 33, and then look at `obn` again. You
should see your representation has changed -- when you created `obn` you passed
a _reference to_ `obj` rather than the _value of_ `obj`, so future changes to
`obj` will be reflected here.

You can give objects different properties, including by writing your own
methods:

```js
obn['countdown'] = function() { return 40 - this.target.age }
obn
obn.countdown()
```

Finally, you can _serialise_ objects in JavaScript Object Notation (JSON)
formatted strings through a call to `JSON.stringify`, and _deserialise_ such
strings back into objects through `JSON.parse`. This is useful if you wanted to,
for example, store an object as a file in your file system, or send a copy of it
over the network. However, look at what happens when we do this:

```js
obstring = JSON.stringify(obn)
pobj = JSON.parse(obstring)
pobj.countdown()
```

A function is not a property that can be encoded in JSON, so the `stringify`
function will omit any methods in your original object from the string
serialisation (or, in some cases, set them to `null`). Note also that this
deserialised `pobj` is a copy of the _values_ that were present in `obstring`.
While future changes to `obj` will be reflected in `obn`, they would not be
reflected in `pobj` -- try this for yourself and see.


## Scripting

Writing complex programs within the interpreter can be a bit unwieldy.
Exit the interpreter with `Ctrl-d`, and use your preferred text editor to
create a file `fib.js` with the following content:

```js
function fib(num){
    if (num == 0){
        return 0;
    }
    if (num == 1){
        return 1;
    }
    return fib(num - 1) + fib(num - 2);
}

for (let i = 0; i < 10; i++) {
	console.log(i + ": " + fib(i));
}
```

You can then run this from the terminal by invoking `node fib.js`. Note the
example of a standalone function (not attached to an object) and a loop, both
constructs that will be useful to you for the below exercises.


## Exercises

1. Body Mass Index (BMI) is a crude measure of how healthy a person's weight is. It can be calculated by dividing a person's weight in kg by the square of their height in metres. 
  - Write a JavaScript function `bmi` that accepts two values (`weight` in kg and
   `height` in metres) and returns the result rounded to 1 decimal place. Test this 
    for a range of values.
  - BMI categories are often used to contextualise raw results. Alter your `bmi`
   function so that it returns the correct category as well as the result value
(e.g., by returning a string with both pieces of information). You can use the
ranges below to set the categories.

|     Category   |      BMI    |
|----------------|-------------|
| Underweight    | < 18.5      |
| Normal         | 18.5 - 24.9 |
| Overweight     | 25.0 - 29.9 |
| Obese          | 30.0 - 39.9 |
| Severely Obese | &ge; 40.0   |


2. FizzBuzz is a common basic programming test. Write a JavaScript function `fizzbuzz` that
   accepts a single integer value `n`. The function should then output to the
console a count from 1 to `n`, but with the following alterations:
    - if a number is divisible by 3, the program should output 'fizz' instead of
      the number
    - if a number is divisible by 5, the program should output 'buzz' instead of
      the number
    - if the number is divisible by 3 _and_ 5, the program should output
      'fizzbuzz!' (exclamation mark optional) instead of the number

3. Sometimes you encounter writers who like to Capitalise Random Words in their
   text. Let's implement this odd behaviour as a JavaScript function. Write a
JavaScript function `signify` that accepts a single string argument `text` and 
randomly decides whether to capitalise each word in the text, then returns the
result.
    - You can use `Math.random()` to generate a pseudorandom number and
      `text.split(" ")` to change the string into an array of words, and can
reverse the split by calling `.join(" ")` on the array. There is a built-in
`.toUpperCase` that you might also find useful.
    - You'll need to decide how often a word should be capitalised, setting a
      probability `p` between 0 and 1. Once you've got the basic functionality
      working, Make `p` an _optional argument_ to your function, with a sensible 
      default (maybe 0.3) that can be overridden by passing an alternative.

