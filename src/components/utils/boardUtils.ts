import { Board , } from "../../type"; 


export const createInitialBoard = (): Board => {
  return Array(9)
    .fill(null)
    .map(() =>
      Array(9).fill(null).map(() => ({
        value: null,
        editable: true,
      }))
    );
};

export const removeCellsForPuzzle = (completeBoard: Board, difficulty: 'easy' | 'medium' | 'hard'): Board => {
  let cellsToRemove = 0;

  switch (difficulty) {
    case 'easy':
      cellsToRemove = 35;
      break;
    case 'medium':
      cellsToRemove = 45;
      break;
    case 'hard':
      cellsToRemove = 55;
      break;
  }

  const newBoard = completeBoard.map(row => row.map(cell => ({ ...cell })));

  for (let i = 0; i < cellsToRemove; i++) {
    let row: number;
    let col: number;

    do {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    } while (newBoard[row][col].value === null || !newBoard[row][col].editable);

    newBoard[row][col].value = null;
    newBoard[row][col].editable = true;
  }

  newBoard.forEach(row =>
    row.forEach(cell => {
      if (cell.value !== null) {
        cell.editable = false;
      } else {
        cell.editable = true;
      }
    })
  );

  return newBoard;
};


