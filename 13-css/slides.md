# Software Tools
(COMS10012 / COMSM0085)

## Week 3: CSS
(or, "How I Stopped Worrying and Learned to Love the Box Model")
 - CSS syntax.
 - Key CSS selectors.
 - The box model
 - An introduction to units and values.

---

## But First...

Review issues from the HTML lab.


---

## CSS

Cascading Style Sheets (we'll get to the 'cascading').

A set of rules that define how HTML elements are displayed.

In most cases, rules refer to the setting of visual properties for a HTML
document element (more technically: to the DOM objects derived from the HTML).

---

## CSS composition

CSS entries follow fairly simple syntax:

```css
selector {
    property : value;
}
```

- `property` is any display property that is meaningful for this element type.
- `value` permitted values will depend on the property.
- `selector` defines which elements this rule can be applied to.

---
## CSS implementation

Your CSS rules should be placed in a stylesheet document e.g., `mystyle.css`.

The browser can then be informed to use a particular stylesheet by a reference
in the HTML document.

```html
<html>
 <head>
    <link rel="stylesheet" href="mystyle.css"/>
 </head>
 <body>
  ...
```

You can also just instruct your browser to apply a custom stylesheet to HTML
documents by default ('user' or 'custom' styles). But as a web designer you
assume your website visitors want to see the webpage the way you intended it to
be viewed.

---
## CSS simple example

```css
p {
 color : red;
}
```

For all `p` elements, set the `color` (font colour) to `red`.

---
## Selectors

Wide range of selection capabilities.

Simplest selector: name of a single tag (e.g, `p`,`a`,`div`). Applies to all elements
of that kind.

Next-simplest selector is a list of tags:

```css
p, div, main {
    color : red;
}
```
---
## Selectors: Class

Syntax for selecting only elements with particular `class` properties:

```css
 p.important {
    color: red;
 }
```

```html
 <p class='important'>This is red</p>
 <p>This is not</p>
```
---
## Selectors: Class

Can also apply to `class` _regardless of element type_:

```css
 .important {
    color: red;
 }
```

```html 
 <p class='important'>This is red</p>
 <p>This is not</p>
 <span class='important'>But this is</span>
```
---
## Selectors: ID

If you wanted to apply style to a particular document element:

```css
 p#uniquebox {
    color: red;
 }
```

```html
 <p id='uniquebox'>This is red</p>
 <p class='uniquebox'>This is not</p>
 <p>This certainly is not</p>
```

Same as class -- `#uniquebox` by itself would apply to?

---

## Selectors: Attribute

Can generalise to select elements by any attribute.

```css
 p[name=tim] {
    color:red;
 }
 div[border=none] {
    color: blue;
 }
```

`p[class='important']` would be the same as `p.important`.

Can also do some fancy partial matching, e.g., `img[title~='flower']` selects
all images where the `title` attribute _contains_ the string 'flower'.

---

## Selectors: Positional

```html
<div class="container">
 <p>direct child</p>
 <div>
  <p>descendant</p>
 </div>
</div>
<p>para one</p>
<p>para two</p>
```

- A _descendant_ is an element that is 'inside' another element, at any level.
- The _child_ is an element that is _directly_ contained inside the parent.
- An element _precedes_ another if it comes at any point earlier at the same level of the document.
- An element _follows_ another if it is the _very next_ element at that level of the document.

---
## Selectors: Positional


- `this that` (space): selects all elements `that` which are _descendants_ of `this`.
- `this > that`: selects all elements `that` which are _direct children_ of the parent `this`.
- `this ~ that`: selects all elements `that` which are _preceded by_ an element `this`.
- `this + that`: selects all elements `that` which directly _follow_ an element `this`.


Just to add complexity: all the rules can be combined.

```css
 div.important > p, h1#main, [title=nowred] ~ span {
    color: red;
 }
```

Worth looking at a [reference guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selectors_and_combinators)

---
## Cascading?

Which rule applies?

```html
<p class='important'>If you want to pass this unit then...</p>
```

```css
p {
    font-size: 12pt;
}

p.important {
    color: red;
}
```

---
## Values

Lots of different properties that can be set, which require different values -- you will need to explore the [MDN documentation]( https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Values_and_Units) to get to grips with all of the options.

However, some common properties relate to _colour_ and _element layout_.

### Color values

As well as `color`, you can set `background-color` and properties like `border-color`.

- Already seen `red`, and `blue`. Some other keywords for common basic colours.
- Also the hexadecimal format `#rrggbb` which accepts values from 00 to FF for each of R G and B.
- _Also_ a function can be called `rgba(r,g,b,a)`, with values 1-255 for RGB and 0-1 for A.

`red` and `#FF0000` are identical. But `#FF0001` or `#FF1111` will still look 'red'.

---

### Layout

When laying out elements on a page, a common issue relates to dealing with space
'around' an element (or between elements). 

Each page element can be thought of as a 'box' with several layers:

- The **content** is the raw material of the element itself (e.g., the space for the text in a `<p>`, or for an image in an `<img>`). 
- The **padding** is the space between the content and the border.
- The **border** is a (sometimes invisible) line 'around' the element, marking its bounds. It can have a thickness.
- The **margin** is the space required to be kept clear _outside_ the border -- other elements must not intrude on this space.

It's common to get confused between padding and margin (making the border visible helps). 

Developer tools give a good visual demonstration of the values (see video for this week).

---

### Layout values

Both `margin` and `padding` can be specified for individual sides, or collectively in clockwise order.

```css
 margin-top: 10px;
 margin-right: 20px;
 margin-bottom: 10px;
 margin-left: 5px;

 margin: 10px 20px 10px 5px;
```

---

### Units of measurement

There are many different ways to specify measurement in CSS.

'Absolute' units try to produce a specific real size:

- `1 px` - 1 'pixel' (however that is interpreted: 1/96th inch).
- `1 pt` - 1 'point' (1/72th of an inch)
- `1 cm` - 1 centimetre (also `10 mm`)
- `1 in` - 1 inch

'Relative' units produce dimensions relative to either the viewport or some
reference element of the page.

- `1 vh` - 1% of the viewport's height (also `1 vw` for width)
- `1 em` - 1 x whatever the size of the font (width of an 'm') is.
- `1 ex` - 1 x whatever the height of an x would be.
- `1 rem` - 1 x whatever the size of the font of the document's root element is.
- `1 %` - 1% of the size of the parent element's corresponding dimension.

**Very** easy to get muddled about units.

---

## Exercises this week

 1. Reading MDN documentation.
 2. Applying basic CSS to a HTML document. 
 3. Getting very frustrated about pink lines.
 4. Reading **even more** MDN documentation.
 5. Using an existing CSS framework.

---
## The End

We'll see you on Friday.
