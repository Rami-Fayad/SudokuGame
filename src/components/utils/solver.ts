
import { Board } from '../../type';
import { isSafe } from './generator'; 

export const solveIncompleteBoard = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === null) { 
        for (let num = 1; num <= 9; num++) {
          if (isSafe(board, row, col, num)) {
            board[row][col].value = num; 
            if (solveIncompleteBoard(board)) return true;
            board[row][col].value = null; 
          }
        }
        return false; 
      }
    }
  }
  return true; 
};


