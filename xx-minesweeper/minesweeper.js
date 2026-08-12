let width = 20;
let height = 20;
let bombChance = 10; /* Should be [0, 100] */

const blank = '⬜';
const bomb = '💣';
const marked = '🚩';
const numbers = ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];

let grid = null;

document.getElementById('newGame').addEventListener('click', newGame);

function resetGame() {
  /* Reset any initial state and get things back to stock */
  const board = document.querySelector('.board');
  while (board.firstChild) {board.removeChild(board.lastChild);}
  grid = null;
}

/* Get a random element from the array */
function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function makeSpinny(element) {
  element.setAttribute("class", `${sample(['spin','spinback'])} ${sample(['slow','medium', 'fast', 'slow','medium', 'fast', 'fastest'])}`);
  return element;
}

/* The grid of tiles forming the board.
All game logic is encapsulated here. */
class Grid {
  constructor(board) {
    this.playing = true;
    this.board = board;

    /* Create the grid of bombs */
    this.grid = new Array(height);
    for (let j = 0; j < height; j++) {
      this.grid[j] = new Array(width);
      for (let i = 0; i < width; i++) {
        this.grid[j][i] = new Tile(i, j);

        /* Add the tile to the page */
        const tile = document.createElement('div');
        tile.id = `tile_${i}_${j}`;
        makeSpinny(tile);
        tile.addEventListener('click', () => this.touchTile(i,j));
        tile.addEventListener('contextmenu', function (e) {
          grid.markTile(i,j);
          e.preventDefault();
          return false;
        });


        tile.appendChild(document.createTextNode(blank));
        board.appendChild(tile);
      }
    }
  }

  /* Check to see if the game is won (or lost) */
  checkStatus() {
    if (!this.playing) return;
    //console.log('Checking for victory');

    let unfound = 0;
    for (let j = 0; j < height; j++)
      for (let i = 0; i < height; i++) {
        let it = this.grid[i][j];
        if (it.isBomb() && it.isTouched())
          this.youLose();
        else if (it.isBomb() && !it.isMarked())
          unfound++;
      }
    if (unfound == 0)
      this.youWin();
    else
      console.log(`Still got to find ${unfound} bombs`);
  }

  youWin() {
    if (this.playing) {
      this.playing = false;
      alert("You win!");
    }
  }

  youLose() {
    if (this.playing) {
      this.playing = false;
      this.touchAll();
      alert("You Lose!");
    }
  }

  /* Touch every cell revealing everything. */
  touchAll() {
    for (let j = 0; j < height; j++)
      for (let i = 0; i < height; i++)
        this._touchTile(i, j);
  }

  /* Touch a specific tile */
  touchTile(x, y) {
    if (this.playing) {
      this._touchTile(x, y);
      this.checkStatus();
    }
  }

  /* Touch a specific tile, but don't care if we're still playing or trigger any victory checks */
  _touchTile(x, y) {
    if (this.canTouch(x, y))
      this.grid[y][x].touch();
  }

  /* Mark a tile as suspicious */
  markTile(x, y) {
    if (this.playing && this.canTouch(x, y))
      this.grid[y][x].mark();
    this.checkStatus();
  }

  /* Count the bombs near to a tile */
  countNearby(x, y) {
    let count = 0;
    for (let j = y-1; j <= y+1; j++) 
      for (let i = x-1; i <= x+1; i++) 
        if (this.canTouch(i,j) && this.grid[j][i].isBomb()) { count++; }
    return count;
  }

  canTouch(x, y) {
    return 0 <= x &&
      x < width &&
      0 <= y &&
      y < height &&
      !this.grid[y][x].isTouched();
  }
}

/* A tile on the board */
class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.touched = false;
    this.marked = false;
    this.bomb = Math.floor(Math.random() * 100) < bombChance;
    //if (this.bomb) {console.log(`Bomb at ${this.x}x${this.y}`);}
  }

  isBomb() {return this.bomb == true;}
  isTouched() {return this.touched == true;}
  isMarked() {return this.marked == true;}


  /* Touch the tile! */
  touch() {
    if (this.touched) return;
    //console.log(`Touching ${this.x}x${this.y}`);

    const me = document.getElementById(`tile_${this.x}_${this.y}`);
    while (me.firstChild) {me.removeChild(me.lastChild);}

    this.touched = true;
    makeSpinny(me);
    
    /* If its a bomb make it a bomb! */
    if (this.isBomb()) {
      me.appendChild(document.createTextNode(bomb));
      /* If it isn't then count the bombs in the surrounding tiles and display that */
    } else {
      let nearby = grid.countNearby(this.x, this.y);
      me.appendChild(document.createTextNode(numbers[nearby]));
      /* If no bombs nearby touch everything in reach */
      if (nearby == 0) 
        for (let j = this.y-1; j <= this.y+1; j++) 
          for (let i = this.x-1; i <= this.x+1; i++) 
            if (!(j == this.y && i == this.x))
              grid._touchTile(i, j);
    }
    this.marked = false;
  }

  /* Mark a cell as being suspicious */
  mark() {
    const me = document.getElementById(`tile_${this.x}_${this.y}`);
    while (me.firstChild) {me.removeChild(me.lastChild);}
    if (this.marked) 
      me.appendChild(document.createTextNode(blank));
    else 
      me.appendChild(document.createTextNode(marked));

    this.marked = !this.marked;
  }
}

function newGame() {
  console.log('Starting new game!');
  resetGame();
  grid = new Grid(document.querySelector('.board'));
}

newGame();

