# Software Tools
(COMS10012 / COMSM0085)

## Week 2: HTML
(or, "Bare-bones Web Development")
 - What 'hypertext' is.
 - The function of textual markup. 
 - The HTML document structure.
 - Generating HTML.

---

## But First...

Review of HTTP lab issues.


---
## Hypertext

The concept is _interactive text_. Rather than documents that can only be
written and read, documents that the reader can interact with.

Context: The physicists at CERN research laboratories were interested in ways of
connecting up their work more effectively.

In the scientific world, a long-established convention that you cite authors
when referring a reader to their work -- but following this citation can be
time-consuming.

Tim Berners-Lee pursued the idea: what if we had a system so that when a
document refers to another document, you could immediately follow that reference
and start reading a copy of the cited article? 

---

## Hypertext

At its core, think 'text with hyperlinks'.

HTML is HyperText Markup Language. A language for 'marking up' text to make it interactive (and, incidentally, provide document
structure).

A HTML document reader (like a browser) has to interpret the markup and present
the result to the user.

Key elements
 - **Tags** indicate meaningful document components.
 - Nesting of tags and text within tags organises document structure.
 - Tags can have **attributes** that affect interpretation of their semantics.

---
## Important HTML tags

Everything is nested within `<html>`.

`<head>` vs `<body>`

Note: this is within the HTML document itself! `<head>` has no relation to HTTP
headers.

+ `<head>` contains `<title>` and `<meta>` tags, to describe `<body>` 
+ `<body>` contains the 'visible' portion of the document.
  - Most document components should be placed within the body.
  - Common contents include `<p>`,`<div>`,`<span>` ...


---
## HTML Document Example

```html

<!DOCTYPE html>
<html lang="en">
 <head>
   <meta charset="utf-8" />
   <title>A web page</title>
 </head>
 <body>
    <h1>An example web-page</h1>
    <p>A paragraph of text here, perhaps with <a href='./another_page/'>a link</a></p>
 </body>
</html>
```
---

## Attributes

In the previous example, one _attribute_ is visible -- the `href` of an `a` tag.
This is one of the most widely-used attributes because it directs linking. You
may also see that `a` elements often use a `target` attribute that instructs
your browser about _how_ it should follow a link.

Some other HTML elements have key attributes that similarly govern their
function: a `form` has an `action` that governs what happens when it is
submitted.

Some other key attributes that you'll see on all elements are `id` and `class`.
IDs are often used for programmatic manipulation of document elements (e.g.,
altering the document using Javascript) while an element's `class` is commonly
used to set a number of visual properties (in CSS -- next week). 


---
## HTML Presentation

There are common visual defaults for GUI browsers (e.g., blue underline).

But the semantic structure of a document is (meant to be) _separate_ from its
presentation.
  - Consider how a browser should read a HTML document to a blind user.

In a browser, the presentation of elements in HTML documents is governed by _stylesheets_.

Next week, we'll be discussing how style is applied via _Cascading Style Sheets_ (CSS).

---
## Workbook Preview: Basic HTML5

We'll present you with a document-writing task -- given a result, figure out how
to write a HTML5 document that represents the intended content and structure. 

Absurdly easy to cheat on this (solution provided). 

Also introduce you to the existence of _validators_ that can check your document
is compliant with standards.

---
## Workbook Preview: Templating

Hand-crafting HTML documents can give you useful insight into how they work.
But often you will want to _generate_ webpages using existing tools.  

This unit's website is presented to you in HTML -- but this HTML is generated
from Markdown source files by Github's code. This is still _static_ content, but
nonetheless not hand-written HTML.

Very often you want _dynamically_ generate HTML documents to reflect some result
of a query by a user.

In this week's lab we introduce you to Thymeleaf, a Java-based system for generating
webpages from templates


```html
<ul th:each="unit : ${units}">
    <li>
        <a th:href="'/unit/' + ${unit.code}" th:text="${unit.code}"></a>
        <span th:text="${unit.title}"></span>
    </li>
</ul>
```



---

## The End

We'll see you on Friday.

