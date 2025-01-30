# Minesweeper

To place JavaScript in a web context, we are going to set a series of challenges
that build towards creating a version of the game Minesweeper that can be played
within a web page. The aim here is to give you experience using JavaScript to 
manipulate the DOM.

Step-by-step goals will be described, but you will have to think a little about
how to accomplish each step, and may need to consult the MDN documentation. 
In particular, getting familiar with arrays may be useful.

## Serving the Page

The first thing to do is to download the `minesweeper.css` and
`minesweeper.html` files from this week's lab folder in the repo, and move them 
to the directory you are going to work in (if you've cloned the repo, you can
simply work in the `lab` folder where they are already). 

Due to a browser security feature known as the [Same-Origin
policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy),
while you can open `minesweeper.html` and see what the page looks like, you
won't be able to develop using an external JavaScript module when loading it as
a file -- your browser requires the JavaScript file to be served over HTTP from
the same source as the HTML file.  The upshot of this is you need to run a
webserver that can serve your files to be accessed at `localhost:8000`. You
could use `darkhttpd` for this, serving this lab's folder in the same way as you
previously served the `web` folder, or if you have Python installed on your
machine you could alternatively create a server that serves the files in your
working directory by running `python -m http.server` -- this is a Python module
that runs a simple HTTP server.

## First JavaScript Events

Once you are able to view `minesweeper.html` being served via `localhost` in
your browser, you need to create the `minesweeper.js` file that the HTML
references.

Your first task is simply to make the 'New Game' button semi-functional. In the
JavaScript file, use `document.querySelector` and `addEventListener` to make it
so that clicking the button calls the function `newGame`. Write a dummy version
of this function that simply makes a `console.log` statement to check this is
working.

## Setting up the Board

Next, make this function meaningful. Using `querySelector` and `createElement`
and `appendChild`, make it so that the `newGame` function adds 400 `div`
elements to the 'board'. Give each element a unique ID (e.g., `tile_1`,
`tile_2`, etc.). You don't need to worry about tile layout -- the CSS file
should handle this for you. 

If you manage this correctly, clicking the 'New Game' button should lay out a
visibly different initial board state. However, what happens if the button is
pressed more than once? Fix your code so that anything _already_ inside the
board is removed before your tiles are added.

## Placing the Mines

We want to identify a scattering of our tiles as 'bombs' that will (later) cause
the player to lose the game if they are clicked on. Define an array `mines`
outside your newGame function, and then _inside_ the function use `Math.random`
to pseudorandomly decide with probability 0.10 whether any particular tile
should secretly be a mine, and add its identifier to the array if so.

Remember, you need to consider what happens when 'New Game' is pressed multiple
times. At the same point as you empty the board before refilling it, you will
need to `pop()` items until the array is empty.

## Interactive Tiles

We have a set of tiles, some of which are theoretically designated as mines, but
the game is not yet playable. 

Write a new function `touchTile` that accepts an argument `tile`. Then, in your
`newGame` function, alter the `div`s you are creating by using
`addEventListener("click", function(){touchTile(i)})` (where `i` is the
identifier you want to pass). This anonymous function construction allows you to
specify that each tile should call `touchTile` when it is clicked, but passing
its own identifier.

Within `touchTile`, use `document.getElementById` to implement the following
logic:
   - If the tile touched is one of your mines, set its `className` to `bomb`
      and set the text content to be a bomb-like symbol (e.g., `*`).  
   - If the tile is not a mine, set its class to `clear`.

You should now be able to click around the board and see the tiles change. If you're
not sure whether you're just not encountering bombs by chance or you haven'
t implemented them correctly, try adjusting the bomb-laying probability in your 
`newGame` function.

## Winning and Losing

The game board can now be interacted with, but players still can't achieve
anything, and they aren't forced to stop playing if they encounter a bomb. 

Create a variable `playable` which is initialised to `true`. Then, using this in
`touchTile`, alter the logic so that the player isn't able to change the state
of any more tiles after they encounter a bomb. This handles our 'losing'
condition -- players that encounter a bomb will see it go off and then have to
start a new game. Remember that you will have to change this back to `true`
when `newGame` is called.

Winning is slightly trickier. We win Minesweeper by clearing all tiles that do
not contain a bomb. To identify whether a player has done this you will need to:
 - Create a new array that tracks the identifiers of un-touched tiles.
 - Initialise this array appropriately during `newGame` (including removing old
   state as you did with `mines`).
 - Remove any cleared tile from the array when it is clicked.
 - Check at the end of `touchTile` whether your array of un-touched tiles is now
   equivalent to the array of mines. _Note: JavaScript doesn't have a ready-made
array comparison operator, so you will need to check whether all the contained values
are the same._
 - If the player has won, congratulate them with an `alert` message, and stop
   the game from being playable.

You may find it is hard to win the game at the moment, so just try to reason
through your code and then come back to test the win condition once you've
implemented the next stages.

## Detecting Mines

The game is now playable, in a sense, but a player's performance is entirely
random -- they just have to guess every tile correctly. We're going to alter 
the game so that players get some information back after clicking on a tile.

Write a function `mineNeighbours` that accepts a `tile` parameter. This function
should return an integer that indicates the number of tiles _neighbouring_ the
target tile that are mines. Each tile has up to eight neighbours, on every side 
and including diagonals.

The fact that there are 20 tiles in every row will be important to your
calculations here. You may also find the remainder operator `%` useful when
dealing with the right and left-hand columns.

Alter `touchTile` so that when a tile is clicked (and isn't itself a mine), if
it has > 0 neighbours that are bombs, you set the tile's text content to display
that number. 

Test this out and you should see that this feedback allows the player to deduce
the location of the mines and avoid them.

## Clearing Space

The game is now fully playable, and even somewhat fun. However, there is some
expected functionality that we haven't implemented. When the player clicks on a
tile and it has no neighbours, they know it is safe to click on every
neighbouring tile. This isn't very interesting work for the player, so we'll do
it for them.

Alter `touchTile` so that if a touched tile has 0 mines as neighbours, it calls
`touchTile` on every _previously un-touched_ neighbour. You might want to
separate out some functionality from your `mineNeighbours` code into a
`getNeighbours` function that you can reuse. Notice that you'll have to think
carefully about how to avoid your code entering an infinite loop going back and
forth between neighbouring tiles -- look at what you've done so far to see how
you are already tracking which tiles have been touched.

If you implement this correctly, then when the player clicks on a tile that
doesn't neighbour a bomb, a nice patch of tiles should be revealed for them,
stopping at 'borders' where there might be bombs.

Try and play your game and catch any issues. It should now be feasible to test
your win condition without too much guesswork.

## Nice-to-have

The game is now functionally complete, but if you like, you can implement the
following features to enrich the player experience: 
 - **Defcon**: Colour-code the warning cells by setting the `color` attribute
   for non-zero bomb-neighbour cells depending on whether the value is 1, 2, 3,
etc.
 - **Chain reaction**: When a bomb is encountered, rather than just revealing
   the bomb the player clicked on, reveal all the bombs on the board.
 - **Timed runs**: Winning is good, but how fast can the player win the game?
   Investigate how you would add a timer to show a winner how long they took.
 - **Scoreboard**: Keep track of performance over multiple games. Add a
   scoreboard to the webpage and use it to track the best games, identified by a
game number and ranked by the time-to-win. 
