import { Board } from '../../type';
import {isValidPlacement} from './validation';

// Helper function to check if a number placement is safe
// export const isSafe = (board: Board, row: number, col: number, num: number): boolean => {
//   for (let x = 0; x < 9; x++) {
//     if (board[row][x].value === num || board[x][col].value === num) return false;
//   }

//   const startRow = Math.floor(row / 3) * 3;
//   const startCol = Math.floor(col / 3) * 3;
//   for (let i = 0; i < 3; i++) {
//     for (let j = 0; j < 3; j++) {
//       if (board[i + startRow][j + startCol].value === num) return false;
//     }
//   }
//   return true;
// };


const fillBoard = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === null) { 
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]); // Shuffle for randomness
        for (let num of numbers) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col].value = num;
            if (fillBoard(board)) return true;
            board[row][col].value = null; // Undo move
          }
        }
        return false; // Trigger backtracking if no number fits
      }
    }
  }
  return true; // Board is fully filled
};

// Helper function to shuffle numbers
const shuffle = (arr: number[]): number[] => arr.sort(() => Math.random() - 0.5);

export const generateCompleteBoard = (): Board => {
  const board: Board = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: null, editable: true }))
  );
  fillBoard(board);
  return board;
};
