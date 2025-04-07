//theme changing variables
const theme = document.getElementById ('theme');
const themeToggle = document.getElementById ('theme-toggle');
const themeIcon = document.getElementById ('theme-icon');
const themeMode = document.getElementById ('mode');
//switch toggle variables
const toggleMode = document.getElementById ('toggle-mode');
const knob = document.getElementById ('toggle-knob');
//image upload variables
const imageUpload = document.getElementById ('image-upload');
const gridContainer = document.getElementById ('sudoku-grid-container');
const canvas = document.getElementById ('canvas');
const sudokuImg = document.getElementById ('sudoku-image');
const ctx = canvas.getContext ('2d');
//loader
const loader = document.getElementById ('fullPageLoader');
const sudokuImgGrid = document.getElementById ('sudokuImgGrid');
//rules button
const rulesContainer = document.getElementById ('rules-container');
const rules = document.getElementById ('rules');
const contentRules = document.getElementById ('content-all-rules');
const arrowIcon = document.getElementById ('arrow-icon');
//reset buttons
const resetImg = document.getElementById ('reset-img');
const resetGrid = document.getElementById ('reset-grid');
//solve buttons
const solveGridButton = document.getElementById ('solve-grid');
const solveImgButton = document.getElementById ('solve-img');
//sudoku grid
const sudokuCells = document.getElementsByClassName ('sudoku-cell');
let sudokuArray = Array (9).fill ().map (() => Array (9).fill (0));

///////////////
//toast function
const createToastContainer = () => {
  const container = document.createElement ('div');
  container.id = 'toast-container';
  container.className = 'fixed bottom-10 right-5 z-50 space-y-2';
  document.body.appendChild (container);
  return container;
};

const createToast = (msg, type = 'info', duration = 3000) => {
  const toast = document.createElement ('div');
  toast.textContent = msg;
  toast.className = `
    px-5 py-3 rounded-lg shadow-lg text-sm font-medium
    text-white animate-fade-in-up transition-opacity duration-300
  `;
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-400 text-black',
    info: 'bg-blue-500',
  };
  toast.classList.add (typeClasses[type] || typeClasses.info);
  const container =
    document.getElementById ('toast-container') || createToastContainer ();
  container.appendChild (toast);
  setTimeout (() => {
    toast.classList.add ('opacity-0');
    setTimeout (() => toast.remove (), 300);
  }, duration);
};
//////////////////
//switch themefunction
themeToggle.addEventListener ('click', () => {
  if (themeMode.innerText == 'light') {
    theme.classList.add ('bg-gray-800');
    theme.classList.add ('text-white');

    theme.classList.remove ('bg-white');
    theme.classList.remove ('text-text');

    themeIcon.classList.remove ('ph-sun');
    themeIcon.classList.add ('ph-moon');
    themeMode.innerText = 'dark';

    contentRules.classList.remove ('text-gray-500');
  } else {
    theme.classList.remove ('bg-gray-800');
    theme.classList.remove ('text-white');

    theme.classList.add ('bg-white');
    theme.classList.add ('text-text');

    themeIcon.classList.add ('ph-sun');
    themeIcon.classList.remove ('ph-moon');

    contentRules.classList.add ('text-gray-500');

    themeMode.innerText = 'light';
  }
});
/////////
//rules
rules.addEventListener ('click', () => {
  contentRules;
  const isCollapsed =
    contentRules.style.maxHeight === '0px' || !contentRules.style.maxHeight;

  if (isCollapsed) {
    contentRules.style.maxHeight = `${contentRules.scrollHeight}px`;
    contentRules.style.opacity = '1';
    arrowIcon.classList.remove ('ph-caret-down');
    arrowIcon.classList.add ('ph-caret-up');
  } else {
    contentRules.style.maxHeight = '0px';
    contentRules.style.opacity = '0';
    arrowIcon.classList.add ('ph-caret-down');
    arrowIcon.classList.remove ('ph-caret-up');
  }
});
// Toggle between image upload and manual input
toggleMode.addEventListener ('change', function () {
  if (this.checked) {
    imageUpload.classList.add ('hidden');
    gridContainer.classList.remove ('hidden');
    knob.style.transform = 'translateX(100%)';

    resetGrid.classList.remove ('hidden');
    resetImg.classList.add ('hidden');
    rulesContainer.classList.add ('hidden');
    solveGridButton.classList.remove ('hidden');
    solveImgButton.classList.add ('hidden');

    loader.classList.remove ('bg-white');
    loader.classList.add ('bg-dark');
  } else {
    imageUpload.classList.remove ('hidden');
    gridContainer.classList.add ('hidden');
    knob.style.transform = 'translateX(0)';
    resetGrid.classList.add ('hidden');
    resetImg.classList.remove ('hidden');
    rulesContainer.classList.remove ('hidden');
    solveGridButton.classList.add ('hidden');
    solveImgButton.classList.remove ('hidden');

    loader.classList.remove ('bg-dark');
    loader.classList.add ('bg-white');
  }
});

// Reset Sudoku Grid
resetGrid.addEventListener ('click', () => {
  document
    .querySelectorAll ('input[type=text]')
    .forEach (input => (input.value = ''));
  sudokuArray = Array (9).fill ().map (() => Array (9).fill (0));
  solveGridButton.disabled = false;
});
/////////
//Reset image
resetImg.addEventListener ('click', () => {
  ctx.clearRect (0, 0, canvas.width, canvas.height);
  canvas.classList.add ('hidden');
  sudokuImgGrid.classList.add ('hidden');
  sudokuImg.value = '';
});
//handling image upload

sudokuImg.addEventListener ('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader ();
  const fixedHeight = 400;
  const fixedWidth = 400;

  reader.onload = event => {
    const img = new Image ();
    img.onload = () => {
      canvas.width = fixedWidth;
      canvas.height = fixedHeight;
      canvas.classList.remove ('hidden');
      ctx.clearRect (0, 0, fixedWidth, fixedHeight);
      ctx.drawImage (img, 0, 0, fixedWidth, fixedHeight);
    };
    img.src = event.target.result;
    console.log (event.target.result);
  };
  reader.readAsDataURL (file);
});

/////////////
//sudoku grid generation
document.addEventListener ('DOMContentLoaded', () => {
  const gridContainer = document.getElementById ('sudoku-grid-container');

  for (let i = 0; i < 81; i++) {
    let cell = document.createElement ('input');
    cell.type = 'text';
    cell.classList.add (
      'sudoku-cell',
      'w-full',
      'h-full',
      'border',
      'border-indigo-500',
      'text-center',
      'font-bold',
      'text-xl',
      'rounded-lg'
    );

    cell.maxLength = '1';

    if ((i + 1) % 3 === 0 && (i + 1) % 9 !== 0) {
      cell.classList.add ('border-r-4');
    }

    if (Math.floor (i / 9) % 3 === 2 && i < 72) {
      cell.classList.add ('border-b-4');
    }

    cell.addEventListener ('input', setSudokuGrid);

    gridContainer.appendChild (cell);
  }
});

//setting sudoku grid value

const setSudokuGrid = () => {
  for (let index = 0; index < sudokuCells.length; index++) {
    const row = Math.floor (index / 9);
    const col = index % 9;

    if (sudokuCells[index].value !== '') {
      sudokuArray[row][col] = Number (sudokuCells[index].value);
    } else {
      sudokuArray[row][col] = 0;
    }
  }

  console.log (sudokuArray);
};

///////////////////////////
//Sudoku solving function
////////////////////////////////
// Check if placing a number is valid
const isSafe = (board, row, col, num) => {
  if (board[row].includes (num)) return false;

  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }

  const boxRow = Math.floor (row / 3) * 3;
  const boxCol = Math.floor (col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
};

//validating the input sudoku array
const isValidBoard = board => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const val = board[i][j];

      if (val !== 0 && (val < 1 || val > 9)) {
        return false;
      }

      if (val === 0) continue;

      for (let k = 0; k < 9; k++) {
        if (
          (k !== j && board[i][k] === val) ||
          (k !== i && board[k][j] === val)
        ) {
          return false;
        }
      }

      const startRow = Math.floor (i / 3) * 3;
      const startCol = Math.floor (j / 3) * 3;

      for (let m = startRow; m < startRow + 3; m++) {
        for (let n = startCol; n < startCol + 3; n++) {
          if ((m !== i || n !== j) && board[m][n] === val) {
            return false;
          }
        }
      }
    }
  }
  return true;
};

//sudoku solve function
const solveSudoku = board => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe (board, row, col, num)) {
            board[row][col] = num;

            const result = solveSudoku (board);
            if (result.success) return result;
            board[row][col] = 0;
          }
        }
        return {success: false};
      }
    }
  }
  return {success: true, board};
};

///////////////////////////
//solving sudoku grid
//////////////////////////////////
//getSudoku digits
const updateGridWithResult = res => {
  console.log (sudokuCells);
  for (let index = 0; index < sudokuCells.length; index++) {
    const row = Math.floor (index / 9);
    const col = index % 9;

    sudokuCells[index].value = res[row][col] !== 0 ? res[row][col] : 0;
  }
};

//solving sudoku grid
solveGridButton.addEventListener ('click', () => {
  console.log (isValidBoard (sudokuArray));

  if (!isValidBoard (sudokuArray)) {
    createToast ('Invalid Sudoku Board!', 'error');
    return;
  }
  const result = solveSudoku (sudokuArray);
  updateGridWithResult (result.board);
  solveGridButton.disabled = true;
});

///////////////////////////////////////
//////////////////

const displaySolvedSudokuGrid = async board => {
  const gridImgContainer = document.getElementById ('sudokuImgGrid');
  gridImgContainer.innerHTML = '';
  gridImgContainer.classList.remove ('hidden');

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];

      const cell = document.createElement ('div');
      cell.className = `
        w-full h-full flex items-center justify-center text-3xl font-bold text-gray-800 bg-white
        border-indigo-500/75
        ${row % 3 === 0 ? 'border-t-4' : 'border-t'}
        ${col % 3 === 0 ? 'border-l-4' : 'border-l'}
        ${row === 8 ? 'border-b-4' : ''}
        ${col === 8 ? 'border-r-4' : ''}
      `;
      cell.textContent = value;

      gridImgContainer.appendChild (cell);
    }
  }
};

//isvalidandfix
const validateAndFixSudokuGrid = async grid => {
  const isValid = (row, col, num) => {
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === num) return false;
    }

    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === num) return false;
    }

    const startRow = Math.floor (row / 3) * 3;
    const startCol = Math.floor (col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c] === num) return false;
      }
    }

    return true;
  };

  const newGrid = grid.map ((row, r) =>
    row.map ((cell, c) => {
      if (cell === 0) return 0;
      return isValid (r, c, cell) ? cell : 0;
    })
  );

  return newGrid;
};
//sudoku image classifier
const sudokuImageClassifier = async () => {
  const file = sudokuImg.files[0];
  const start = Date.now ();

  if (!file) {
    createToast ('Please select an image.', 'error');
    return;
  }
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const fileExtension = file.name.split ('.').pop ().toLowerCase ();
  if (!validExtensions.includes (fileExtension)) {
    createToast ('Invalid file type!', 'error');
    return;
  }

  try {
    const formData = new FormData ();
    formData.append ('file', file);
    loader.classList.remove ('hidden');
    document.getElementById ('loading-msg').innerText = 'Processing...';

    // const url = 'http://127.0.0.1:8000/process-sudoku/';
    const url = 'https://sudoku-server-tsc4.onrender.com/process-sudoku/';

    const timeoutDuration = 30000;
    let timeoutReached = false;

    const timeout = setTimeout (() => {
      timeoutReached = true;
      console.log (document.getElementById ('loading-msg'));
      document.getElementById ('loading-msg').innerText =
        'Server is booting... Please wait a moment.';
    }, timeoutDuration);

    const res = await fetch (url, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json ();
    const end = Date.now ();
    const duration = end - start;

    if (duration > timeoutDuration && !timeoutReached) {
      document.getElementById ('loading-msg').innerText =
        'Server is booting... Please wait a moment.';
    }
    const validateData = await validateAndFixSudokuGrid (data);
    const solvedBoard = solveSudoku (validateData);
    displaySolvedSudokuGrid (solvedBoard.board);
    canvas.classList.add ('hidden');
    loader.classList.add ('hidden');
  } catch (err) {
    console.log (err);
    loader.classList.add ('hidden');

    createToast ('Sorry!Something went wrong!', 'error');
  }
};

solveImgButton.addEventListener ('click', sudokuImageClassifier);
