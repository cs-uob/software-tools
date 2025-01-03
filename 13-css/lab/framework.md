# Using a CSS Framework

Now that you know some CSS, you could write your own framework - one or more stylesheet files that implement your idea of good design. In this exercise we will look at some examples.

## Milligram

[Milligram](https://milligram.io) is, in its own words, a "minimalist CSS framework".

Download the [page1.html](./page1.html) file and open it in the browser: it contains some text and a sign-up form for a CSS conference.

Add the following to the page head:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css">

```

  - The first one loads Google's [Roboto web font](https://fonts.google.com/specimen/Roboto), which the designers of Milligram selected as their default. Because it is loaded as a web resource, it should work across different browsers and operating systems, you don't need to install it first.
  - The next line loads `normalize.css`, an alternative to `reset.css` that provides a consistent stylesheet across browsers. Try out the page with just the first two stylesheets and see how it looks now - the font won't have changed because no-one has set `font-family` yet, that will happen in the next stylesheet, but the margins will be slightly different.
  - The third one adds Milligram itself. Your page now uses a different style, for example the form fields and labels are laid out vertically and the register button is purple.

Milligram chooses to style the whole page by default, but you can customise this further. One of their features is a _container_ that gives its content a fixed maximum width.

  - Add `class="container"` to the `<main>` element, save and reload. See how the page behaves when you make the window wider and narrower. The page will always have some left/right padding, but the form adapts to the window size.
  - In the developer tools, activate mobile mode a.k.a. _toggle device emulation_, on chrome/edge this is the second icon from the left in the top left of the developer panel. The text looks much too small now!
  - This is due to a number of factors including higher pixel density on mobile screens. Milligram can handle mobile devices, but it needs the following line in the header:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

This line, which is often (but not always) good practice to include in a HTML5 page anyway, tells a mobile browser (or a device pretending to be one) to adopt sensible defaults including larger fonts depending on the pixel density and no horizontal scrollbars. You can read more about this [on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag).

On [the Milligram documentation page](https://milligram.io/#typography) you can read more about the elements that Milligram styles for you, and how you can customise this (e.g. buttons).

Have a look in your browser's developer tools at how Milligram styles the page: select an element in the _Elements_ tab (or right-click it and choose _Inspect_), then look at the styles that appear in the _Styles_ area. How does Milligram set the following?

  - Size of heading fonts
  - Form fields take up the full width of the container
  - Form labels and fields appear below each other
  - Labels are closer to their own field than the field above
  - Size and centering of everything in a container on wide enough screens

## Bulma

[Bulma](https://bulma.io) is a larger but still fairly lightweight CSS framework. Unlike Milligram, it only styles parts of the page you tell it to (but it sets a default font), and it has some more components to build things like menus or panels.

Start with [page2.html](./page2.html), have a look at the raw page and then add the following to the header (the viewport tag is already there):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.css">
```

Note: Bulma, like most frameworks, comes in two formats: `bulma.css` is the CSS file with human-readable formatting, and `bulma.min.css` (at the same location) is the minified version with all unnecessary whitespace removed and so is slightly quicker to download.

The Bulma sources [on github](github.com/jgthms/bulma) are actually in SASS format, a language that compiles to CSS but offers extra features in the source file like nested blocks and variables. (After SASS was created, variables were introduced in CSS too, but with a different syntax.)

Bulma works with custom class names. For example, we are going to make the first heading into a banner that spans the whole page width - called a _hero_ in web design circles. Bulma has classes for this.

  - First, add `class="title"` to the h1 heading, save and reload the page.

This tells Bulma to style it as a title/heading element. On the [title element page](https://bulma.io/documentation/elements/title/) you can see that the correct way to get a top-level heading is with the classes `"title is-1"`, whereas a `"title is-2"` would be a second-level heading (slightly smaller font):

```html
<h1 class="title is-1">Title 1</h1>
<h2 class="title is-2">Title 2</h2>
```

This looks like you are saying the same thing twice, and you are, but it lets you keep the structure and the styling separate - tag names give structure, class names give styling. Note that this method is a convention by the Bulma designers, which other designers might not agree with, not part of the HTML/CSS standard.

Now to the Hero part. According to the Bulma documentation for the [hero component](https://bulma.io/documentation/layout/hero/), we need a container with class `hero` and a direct child with class `hero-body`, so

  - Add class `hero` to the header tag.
  - Add a child div `hero-body` inside it that wraps the `h1` tag.
  - Set the classes `title is-1` on the h1 tag itself.

You now have an eye-catching element at the top of your page.

Bulma also lets you give an element the class `content` to tell it to style everything within that tag based on the tag names. Class `section` creates a section with spacing before/after, and class `container` makes something fixed width and centered.

  - Add class `content` on the `main` tag. Reload the page and observe the changes.
  - Add a `div` inside main that wraps all the content inside, and give it class `container`. Reload again and observe the change.
  - Notice that the first h2 heading text touches the bottom of the hero area, which is not good design - text needs space between it and edges of coloured areas. Create a section tag as the direct child of the container, and give it class `section` so your code should look like this:

```html
<main class="content">
    <div class="container">
        <section class="section">
            ... content ...
```

For the next exercise, style the form.

  - Put another section tag around the form and its heading (so the container tag will have two direct children, both of them sections).
  - Using the Bulma [form documentation](https://bulma.io/documentation/form/general/), add tags and classes to the form as necessary so it looks similar to the Milligram one (full width fields, labels immediately above the fields, coloured button with rounded corners). You don't have to make the button purple, use `is-primary` to make it blue.

Finally, add and style a [bulma component](https://bulma.io/documentation/components/) of your own choice on the page.

## Bootstrap

The most popular CSS framework is [Bootstrap](https://getbootstrap.com), developed by Twitter. If you are interested and have some spare time, you can have a look at it - it has lots of different components and options to customise the styling further with themes.

Bootstrap includes a JavaScript file as well as a stylesheet: for some components like tabbed pages, you need the scripts to make clicking on a tab switch to the correct content.
