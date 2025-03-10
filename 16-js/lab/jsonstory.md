# Asynchronous JavaScript

For this week's exercise, we are going to create a primitive sort of reader that
allows the user to read a book that has been prepared as a JSON object. Then we
will extend this with a function that allows the reader to look up the
definitions of words as they are reading.

### Setup

Begin by running the command `python3 -m http.server --cgi` in the directory for
this week's lab.  If you are copying materials from the site rather than working
within a copy of the repository, note that you will need all of
`storypage.html`,`storypage.css`,`anabasis.json` and the contents of the
`cgi-bin` folder. Visit `localhost:8000` in your browser to view the default
page content.

### Loading the Story

Create the `storypage.js` file referenced in the HTML. Within that file, create
a variable `story` that will hold the overall story object. 

Use `fetch` to retrieve `anabasis.json`.  This will produce a promise of a JSON
response, which you should handle first of all through a `.then` that calls
`response.json()`.  Then, in a chained `.then`, you will want to set the value
of `story` to the data that results from the previous call, and finally call an
`initialise` function to set up the page visually.

Take a look at the JSON file to help with the next part. In your `initialise`
function:

1. change the default document title and `h1` text to reflect the title of the
   story loaded.  
2. add information about the author and translator to the 'infopane' element.
3. load the first page of story content into the 'page' element.

### Navigating 

Using event listeners, make it so that clicking the `next` and `prev` elements
alters the displayed page. Keep track of the current page and the total number
of pages in the infopane at the top. Remember to consider what should happen
when the user attempts to use `prev` on the first page, or `next` on the last
page.

_(Optional):  Add a form with a 'number' input type to the infopane that allows
a user to jump to a specific page by typing in a number and pressing Enter._

### Defining Words

This part relies upon the server-side `whatmeans` script, which requires the
Python `requests` library. You can install this on Vagrant with `sudo apt get
install python3-requests`.

Add an event listener to the `dictform` that:
 1. Prevents the default form submission event (look up how to do this).
 2. Queries `cgi-bin/whatmeans` with a parameter `term` set to the value from the `dictbox`
 3. Handles the response, which in successful queries should be HTML that can be
    added directly to the `resultbox`. 

