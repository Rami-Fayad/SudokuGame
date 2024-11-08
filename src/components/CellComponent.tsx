
import React from 'react';
import { Cell } from '../type';
import '../styles/CellComponent.css';

interface CellProps {
  row: number;
  col: number;
  cell: Cell;
  onChange: (row: number, col: number, value: number | null) => void;
  hasConflict?: boolean; 
}

const CellComponent: React.FC<CellProps> = ({ row, col, cell, onChange, hasConflict }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      onChange(row, col, null);
      return;
    }

    if (value.length > 1) {
      onChange(row, col, null);
      return;
    }

    const numValue = parseInt(value, 10);

    if (numValue >= 1 && numValue <= 9) {
      onChange(row, col, numValue);
    } else {
      onChange(row, col, null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Backspace' ||
      e.key === 'Tab' ||
      e.key === 'Enter' ||
      e.key.startsWith('Arrow')
    ) {
      return;
    }

    if (e.key < '0' || e.key > '9') {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text" 
      value={cell.value !== null ? cell.value.toString() : ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown} 
      disabled={!cell.editable}
      className={`cell-input ${cell.editable ? 'editable' : 'not-editable'} 
      ${hasConflict ? 'conflict' : ''}${!cell.editable ? 'generated-cell' : ''}`} 
    />
  );
};

export default CellComponent;
