# Software Tools
(COMS10012 / COMSM0085)

## Week 4: Design with CSS
(or, "Placing a Div with Style and Grace")
 - Why developers can spend so much time on visual design.
 - An introduction to CSS grids
 - Responsive layouts and media queries.


---
## But First...

Review issues from the first CSS lab.


---

## Design is hard

This unit is trying to teach you some fundamental understanding of CSS.

CSS can be hard to debug and understand -- technical issues.

But successfully designing styles for real websites can also be hard in a non-technical sense. 
There are key principles (links to fundamentals of ergonomics, audience expectations, etc.) but fundamentally a lot comes down to
questions of taste, style, fashion -- web design is a _craft_ which combines
engineering principles with judgement and taste. 

Some concepts you may find handy:
 - <s>stealing</s> ideas from other websites
 - let designers create frameworks which you can apply (covered last week)
 - grid-based page layouts (big focus in this week's lab)
 - responsive layouts (also this week)


---

## Workbook Preview: The Grid

A crucial web design decision is how you should lay out elements on a webpage. A
history of web design would centre on approaches to this problem.

A lot of modern web design makes use of an approach to layout that creates a
conceptual 'grid' for laying out page components. 

This doesn't necessarily mean the page elements each take up one 1x1 space on the grid -- often the grid becomes a 'coordinate system' for page elements.


---
## Grids: The Parent

On the container element which will hold a grid, style `display: grid`. 

The general layout for the grid can be configured here as well:

- `grid-template-columns` defines the number and widths of the grid columns.
- `gap` defines the gap between grid cells

(To give a gap 'around' the grid, what basic CSS property would you use?)

---
## Grids: The Children

By default, each child element takes up the next free 1x1 space.

You can set placement rules for each element:
 - `grid-row-start` and `grid-row-end` let you specify on which row the element
   should start and on which it should end (same for column).
 - a shorthand for this is `grid-row: 1 / 3` -- from row 1 to row 3.
 - alternatively `span N` can give an element width (or height) in terms of N
   rows/columns, without fixing its position.

---

## Workbook Preview: Responsive Layout

An important issue for web designers to be aware of is that the devices people
view their web page on can be very different.

Displays that make for excellent interaction on a desktop or laptop might be
unusable on a smartphone or tablet. 

To handle this issue, CSS enables _media queries_ -- we can issue CSS rules
_conditionally_ upon certain presentation device constraints, to (for example)
make our site work differently on screen of a certain size.

```css
@media screen and (max-width: 600px) {
  body {
    color: blue;
  }
}
```

---

## Media Queries

General syntax is:

```css
@media media-type and (media-feature-rule) {
  /* CSS rules go here */
}
```

`media-type` mostly takes two values of interest, `print` and `screen`

`media-feature-rule` lets you query properties such as:
  - viewport width (`max-`,`min-`, and range syntax)
  - orientation
  - whether there is a pointing device

---

## Media Feature Rule Combinations

```css
@media screen and (min-width: 600px), screen and (orientation: landscape) {
  /* … */
}
```

```css
@media (not (width < 600px)) and (not (width > 1000px)) {
  /* … */
}
```

```css
@media (30em <= width <= 50em) {
  /* … */
}
```
---

## The End

We'll see you on Friday.
