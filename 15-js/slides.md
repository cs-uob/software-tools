# Software Tools
(COMS10012 / COMSM0085)

## Week 5: Javascript Fundamentals
(or, "Getting Your Webpage Moving")
 - Introduction to JS syntax and basic questions
 - The DOM and key usages
 - Putting JS in your webpage.

---

## But First...

Review issues from the HTML+CSS labs.


---
## What is JavaScript?

1. An interpreted language, using just-in-time compilation
    - 'Quirky' but easy to learn, dynamically-typed, widely-supported.
2. The scripting language of choice for the web and for browser APIs
    - Easiest way to write a program most people can run.
3. The most common way to introduce complex 'dynamic' elements into web pages
    - In some cases, websites are completely broken without JS.


---
## JavaScript Syntax: Variables

```javascript
const birthdate = "2005-02-11"
let age = 20
```

Can also see `var` in place of `let`. `var` is an older construct that permits some odd things:

- Variables can be declared after they are used ("hoisting").
- Multiple declarations of the same identifier are accepted.

Worth understanding what it is, but for modern development, don't use `var`, use `let`.

Note: no type declaration!

---

## JavaScript Syntax: Maths

Two types of number: 

```javascript
let integer = 7
let floating = 7.1
console.log(integer + floating)
console.log(typeof(integer + floating))
```

Definitions can accept other number base systems:

```javascript
let ahexnum = 0xEF
let abinnum = 0b01101011
console.log(ahexnum)
console.log(abinnum)
```

Ordinary operators: `+`,`-`,`/`,`*`

Also exponentiation: `**` and modulo `%` and increment `integer++`


---

## JavaScript Syntax: Strings

One addition that goes wrong:

```javascript
let bignum = "1001"
console.log(bignum + 3)
```

Strings can be defined with double, single or backtick quote marks. Strings with backticks are _template literals_ and can embed code.

```javascript
let unit = "Software Tools"
const intro = `Welcome to ${unit}`
console.log(intro)
```


---

## JavaScript Syntax: Branching

Mostly familiar constructs `if/else`:

```js
if (a === b && b === c){
    console.log("all equal!")
} else if (a === b || b === c) {
    console.log("only one equality!")
} else {
    console.log("neither equal!")
}
```

Switch statements:

```js
switch(input){
    case "hello":
        console.log("Hello yourself, what's on your mind?")
        break;
    case "bye":
        console.log("Wait, come back!")
        break;
    default:
        console.log("How interesting, tell me more...")
        break 
}

```

---

## JavaScript Syntax: For Loops

Two main loop styles:

```javascript
for(let i = 0; i < 3; i++){
    console.log(i)
}
```

```javascript
const list = ['cat','dog','pony']
for (const item of list){
    console.log(item)
}
```
For working with arrays there are also `.map` and `.filter` approaches.

To control iteration you can use `break` and `continue`.

---

## JavaScript Syntax: While Loops


```js
let playing = true;
while(playing){
    //do some things
}
```

```js
let playing = true;
do {
    //do some things
} while(playing)
```


---

## JavaScript Syntax: Functions

```javascript
const topics = []
function help(topic){
    topics.push(topic)
    console.log(`Sorry, I don't know anything about ${topics.join(' or ')}`)
}

help("HTML")
help("CSS")
help("JavaScript")
```

---

## JavaScript Syntax: Objects

```javascript
const planet = {}
planet.name = "Earth"
planet.rank = 3
const moon = {name: "Moon", rank: 3.1}
planet.moon = moon
console.log(planet)

const otherplanet = { name: "Venus", rank: 2 }
console.log(otherplanet)

```


---
## The DOM 

The Document Object Model represents a web page in memory as a tree of objects.

JavaScript run in the browser can access the DOM API provided by the browser to
interact with page elements. JavaScript that changes a page does so by
changing the DOM. Programmatically you will see this through use of the 
`document` object. 

Common usages:

```js
document.getElementById()
document.querySelector()
document.querySelectorAll()
document.createElement()
```
---
## Interacting with Elements

See below MDN example:

```js
document.body.onload = addElement;

function addElement() {
  // create a new div element
  const newDiv = document.createElement("div");

  // and give it some content
  const newContent = document.createTextNode("Hi there and greetings!");

  // add the text node to the newly created div
  newDiv.appendChild(newContent);

  // add the newly created element and its content into the DOM
  const currentDiv = document.getElementById("div1");
  document.body.insertBefore(newDiv, currentDiv);
}
```

---
## Places you find JavaScript

- 'External' -- In a `.js` file, loaded into a web page context through a `<script type="text/javascript" src="target.js"/>` reference, usually in the `<head>`.
- 'Internal' -- Inside `<script>` elements in the page source itself. 
- As the content of certain element attributes, like a button's `onclick` action (don't do this, use `addEventListener`).

---
## Script Loading Strategies

Trip-up: you're using JS to manipulate page elements, but the code isn't working
because _the JavaScipt is being executed before the page is finished loading_. 

Fixes:
 - Inline `<script>` at the bottom of the page ensures all elements are loaded
 - External `<script>` can use `type="module"` or the `defer` attribute.
 - Set your code to trigger from the event `document.body.onload`. 

---

# The End

We'll see you on Friday.
