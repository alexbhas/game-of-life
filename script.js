const canvas = document.getElementById('canvas');
const resetButton = document.getElementById('resetButton');
const pauseButton = document.getElementById('pauseButton');
const ctx = canvas.getContext('2d');

const rows = 60;
const cols = 60;
const cellSize = 10;

let grid = [];
let nextGrid = [];

let isPaused = false;

function initializeGrids() {
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    nextGrid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = Math.random() > 0.7 ? 1 : 0;
      nextGrid[i][j] = 0;
    }
  }
}

resetButton.addEventListener('click', () => {
    initializeGrids();
    drawGrid();
  });

function drawCell(x, y, state) {
  ctx.fillStyle = state ? 'black' : 'white';
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function drawGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      drawCell(i, j, grid[i][j]);
    }
  }
}

function updateGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let neighbors = 0;

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if (x === 0 && y === 0) {
            continue;
          }

          let row = (i + x + rows) % rows;
          let col = (j + y + cols) % cols;
          neighbors += grid[row][col];
        }
      }

      if (grid[i][j] === 1 && neighbors < 2) {
        nextGrid[i][j] = 0;
      } else if (grid[i][j] === 1 && neighbors > 3) {
        nextGrid[i][j] = 0;
      } else if (grid[i][j] === 0 && neighbors === 3) {
        nextGrid[i][j] = 1;
      } else {
        nextGrid[i][j] = grid[i][j];
      }
    }
  }

  grid = nextGrid.map(row => [...row]);
}

function runGame() {
  if(isPaused){
    return;
  }

  drawGrid();
  updateGrid();
  setTimeout(runGame, 100);
}

pauseButton.addEventListener('click', () => {
    if (isPaused) {
      isPaused = false;
      pauseButton.textContent = 'Pause';
      runGame();
    } else {
      isPaused = true;
      pauseButton.textContent = 'Resume';
    }
  });

initializeGrids();
runGame();