// src/components/Board.tsx
import React from 'react';
import { Board as BoardType } from '../type';
import CellComponent from './CellComponent';
import '../styles/Board.css';
import { isValidPlacement} from './utils/validation'

interface BoardProps {
  board: BoardType;
  onCellChange: (row: number, col: number, value: number | null) => void;
}

const SudokuBoard: React.FC<BoardProps> = ({ board, onCellChange }) => {
    const getCellConflicts = (row: number, col: number): boolean => {
        const value = board[row][col].value;
        if (value === null) return false;
        return !isValidPlacement(board, row, col, value);
      };
  return (
    <div className='sudoku-board'>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <CellComponent
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            cell={cell}
            onChange={onCellChange}
            hasConflict={getCellConflicts(rowIndex, colIndex)} // Pass conflict status
          />
        ))
      )}
    </div>
  );
};

export default SudokuBoard;
