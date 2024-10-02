# Software Tools
(COMS10012 / COMSM0085)

## Week 3: Regular Expressions 
(or, "Surprise! Theory of Computation Matters!")
- An introduction to `grep` and `sed`
- Some key regular expression syntax
- One of the most famous Stack Overflow answers of all time.
- What a regular language is and isn't.

---

## But First...

Issues and topics from last week's lab:

1. Still not got Vagrant working.
2. Filesystem confusion.


---

## Workbook 3 Preview: grep

*G*lobal *R*egular *E*xpression *P*rint.

Regular expressions are a series of characters that define a pattern that we
want to select or find within a piece of text. The regular expression rules form
a primitive _grammar_ (more on this later) that can be used for specific purposes. 

`grep pattern file`

The patterns can be sequences you want to find.

`grep ench /usr/share/dict/cracklib-small`

But also include control characters with special meaning

`grep ^ench /usr/share/dict/cracklib-small`

`grep ench$ /usr/share/dict/cracklib-small`

`grep ^..ench..$  /usr/share/dict/cracklib-small`

Searching for patterns in text is an extraordinarily common task for
programmers, and regular expressions are _much_ more powerful than the above
indicates.

---

## Workbook 2 Preview: sed

`grep` helps you _find_ patterns in text. But what about _editing_ text using
these patterns?

`sed` is a *s*tream *ed*itor. You pipe text to it and it outputs text edited
according to the commands given. Has a complex editing language of its own, but
most commonly used as a way to edit using regular expressions.

`sed 's/REGEXP/REPLACEMENT/'`

`echo "This is the best" | sed 's/best/worst/'`

`echo "This is the best" | sed 's/\(is \)\+/at was /'`

`echo "This is the best" | sed 's/\([^ ]\+\) \(.*\)/\2 "\1"\?/'`

---

## A famous Stack Overflow answer about regex

[Read along](https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags)

---

## Why?

A regular expression follows rules that make up a _formal language_. 

Unlike a _natural language_, a formal language is fully encapsulated by rules
that describe how it works.

A fundamental tenet of computer science: defining a formal set of rules is
_equivalent_ to describing a machine. 

A grammar is a machine for judging (parsing) whether a string is valid.


---
## Regular language

A regular expression defines a grammar from the class of languages known as
_regular language_. 

There is a hierarchy of language types: 

regular < context-free < context-sensitive < recursively enumerable

All regular languages are context-free, but not all context-free languages are
regular (etc.).

(Learn more: 'Chomsky hierarchy')

---
## The machines

For a language that is recursively enumerable (but not anything simpler), the
only machine that can parse it is a **Turing Machine** -- a fully-capable
'computer' operating on (theoretically) infinite tape. 

A context-sensitive language can be parsed by a form of Turing Machine operating under
slightly more reasonable restrictions ('**linear-bounded automaton**').

A context-free language can be parsed by a **pushdown automaton** -- a simple
machine that has access to a _stack_. 

A _regular language_ can be parsed by a **finite state automaton**.


---
## Finite State Machines

Simply: You can list all the states this machine will ever be in, and all the
inputs that will cause state transitions.

Can actually represent a FSM/FSA as a simple table of states and transitions.

Typically represented as a state transition graph. 

e.g. 
 - `a+bc`...
 - `a+b?c`...
 - `[aA]a*b?c`...

---
## What can't we draw?

Finite State Machines are _very limited_ machines. There are things you **cannot** express in a state transition graph (and hence, a regular language). 

One simple example: matching arbitrary numbers of characters like `<` and `>`

Can express known quantities:
 `<(things)>` and `<<(things)>>`
   
Can express permissive relations:
 `<*(things)>*` -- any number of `<`, and any number of `>`

But we can't make the first and second number equivalent, because FSMs _have no memory_. You need a _stack_ (or equivalent) to track numbers like this. 

(Look back at the Stack Overflow question)

---
## Deeper considerations

Regular expression engines can have _extensions_ that let them handle patterns outside of regular language (so, no longer strictly a _regular_ expression) -- these can be useful, but you'll often run into different hurdles. Still a bad choice for parsing an XML structure.

For _bounded_ cases where you know how the input is formed (e.g., a specific set of webpages), parsing tasks can be much simpler than if you need to parse e.g., _any valid HTML page_. Sometimes you just want to `grep` a specific HTML document and that's fine.

The question was specifically concerned with matching _opening tags_ in XHTML. While HTML isn't regular, theoretically, the subset of HTML that is well-formed opening tags _is_ regular (and so parseable by a regex!). In practice, though, HTML opening tags seen and handled in the wild are often not well-formed, and there are a lot of difficult cases to consider.

---
## The End

We'll see you on Friday.
