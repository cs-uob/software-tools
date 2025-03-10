# Software Tools
(COMS10012 / COMSM0085)

## Week 7: Asynchronous JavaScript
(or, "Promises Made, Promises Kept")

 - Synchronous vs asynchronous execution
 - Promises and promise handling
 - The `fetch` method


---

## But First...

Review issues from last week's JS lab.


---

## Asynchronous execution

Most of the code you have encountered so far is _synchronous_: each line completes before the next one runs.

```js
let b = 20
b++
console.log(b)
b--
```

But it doesn't have to be: if so instructed a process can _split_, and divide attention between code for Task A and code for Task B.

```js
async function doThing(){
    console.log("Task B started")
    //do some things
    console.log("Task B ended")
}

doThing()
console.log("Task A started")
// do some other things
console.log("Task A ended")
```
---

## Asynchronous != simultaneous

Asynchronous code can difficult to reason about because switching can happen at any point. 

In future studies you'll encounter ways of writing multithreaded code that can safely read from and write to variables. 

In this unit we are only concerned with how JavaScript handles asynchronous
function invocations.



---

## Async/Await

Two keywords that are important:

- `async` makes a function asynchronous. This means it returns instantly upon
  being called, before the function body is finished executing.
- `await` is an instruction you can prefix to an asynchronous invocation to make
  it synchronous -- your code will 'wait' until the asynchronous call is
complete.

```js
async function doThing(){
    //do some things
}

console.log("I'm going to do it.")
await doThing()
console.log("It's done.")
```

---

## Making Promises

What does an async function return?

A `Promise` of a result. A `Promise` is a generic object that can have one of
three states:
 - 'pending' : the promise is unresolved (execution is still ongoing)
 - 'fulfilled' : the execution has resolved successfully
 - 'rejected' : execution has failed  

Initially all Promises are 'pending', when execution completes their state and content is updated.


---

## Keeping Promises

You have previously seen JavaScript examples of a pattern 'call this function
when something happens' in _event handling_ (e.g., click events). 

The same concept can be applied to async functions. (You could even model
human users as just slightly more complicated asynchronous functions). 

There are two 'events' that need handling for an asynchronous function: it
completes successfully ('success handler') or it fails ('failure/error
handler').

You can attach these handlers to a Promise using the method `.then(successCallback,
failureCallback)`.

---


## Keeping Promises: Example

```js
async function destroyTheDeepState(){
    //classified contents, takes 2-3 months
}

function deepStateDestroyed(){
    console.log("Celebrate!")
}

function deepStateNotDestroyed(){
    console.log("Oh no!")
}

let promisedit = destroyTheDeepState()
promisedit.then(deepStateDestroyed, deepStateNotDestroyed)
//continue doing other things in the meantime
```

---

## Keeping Promises with Anonymous Functions

```js
async function destroyTheDeepState(){
    //classified contents, takes 2-3 months
}

let promisedit = destroyTheDeepState()
promisedit.then(function(result){ 
    console.log("We got "+result+", celebrate!")
}, function(error){
    console.error("Oh no, there was an "+error)
})
//continue doing other things in the meantime
```

---

## Keeping Promises with Syntactic Sugar

```js
async function destroyTheDeepState(){
    //classified contents, takes 2-3 months
}

destroyTheDeepState()
 .then(result => console.log("We got "+result+", celebrate!"))
 .catch(error => console.error("Oh no, there was an "+error))
//continue doing other things in the meantime
```

`.catch(functionName)` is just `.then(null, functionName)`.

---

## Chaining Promises

A common situation is that you want to promise to do something when a previous
operation succeeds, possibly multiple times. 

One way to handle this is just by carefully structuring callbacks. However,
`.then` can make this easier, because it makes each callback into a _new_
promise.

```js
let promisedit = destroyTheDeepState()
let conditionalPromise = promisedit.then(saveEconomy)
let yetAnotherPromise = conditionalPromise.then(winMidterms)
```

This means that you can write a chain of `.then` statements defining discrete
asynchronous functions that are dependent on each previous step's result -- and
they can even share an error handler.

```js
destroyTheDeepState()
 .then(saveEconomy)
 .then(winMidterms)
 .catch(panic)
```

---


## Fetching Resources

You commonly want to use async when a function is going to take a long (or
indeterminate) amount of time. The prototypical example of this is fetching
resources from a slow appendage (e.g., disk storage, or network).

Accordingly, the inbuilt `fetch` function which retrieves resources is `async`,
and returns a `Promise` of a `Response`.

This means you call `fetch(url)` and use `.then` to provide handlers for the
results. The handler for success will be given a `Response` object. To get the
content of that response, you can use one of the `Response` methods, like
`Response.json()` or `Response.text()`.

If you don't mind waiting for the result, you can use `await` to pause until the
`Response` comes back.

```js
let resp = await fetch(url)
```

---
## Making `fetch` happen

```js
fetch("https://openapi.moc/getdetails?name=bob")
 .then(response => response.json())
 .then(jsondata => console.log(jsondata))
 .catch(error => console.error(e))
```

---

## The End

We'll see you on Friday.
