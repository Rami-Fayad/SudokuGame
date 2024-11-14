import { Board } from '../../type';
import {isValidPlacement} from './validation';
import { createInitialBoard } from './boardUtils';

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
        return false;
      }
    }
  }
  return true;
};

const shuffle = (arr: number[]): number[] => arr.sort(() => Math.random() - 0.5);

export const generateCompleteBoard = (): Board => {
  const board = createInitialBoard();
  fillBoard(board);
  return board;
};
