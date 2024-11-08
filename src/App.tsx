
// src/App.tsx
import React, { useState, useEffect } from 'react';
import SudokuBoard from './components/Board';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CS
import { Board as BoardType, Cell } from './type';
import { isValidPlacement ,validateBoard as validateBoardUtil } from './components/utils/validation';
import { generateCompleteBoard } from './components/utils/generator'; 
import Modal from './components/DifficultyModal';
import { solveIncompleteBoard } from './components/utils/solver';
import { saveGameToLocalStorage, loadGameFromLocalStorage } from './components/utils/storageUtils'; // Import the storage functio
import './App.css';

const createInitialBoard = (): BoardType => {
  return Array(9)
    .fill(null)
    .map(() =>
      Array(9).fill(null).map(() => ({
        value: null,
        editable: true,
      }))
    );
};

const removeCellsForPuzzle = (completeBoard: BoardType, difficulty: 'easy' | 'medium' | 'hard'): BoardType => {
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
    newBoard[row][col].editable = true; // Set the cell as non-editable
  }

  
  newBoard.forEach(row => 
    row.forEach(cell => {
      if (cell.value !== null) { // Remaining filled cells
        cell.editable = false; // Mark as editable
      } else {
        cell.editable = true; 
      }
    })
  );

  return newBoard;
};

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardType>(createInitialBoard());
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); 

  useEffect(() => {
    const { board: savedBoard, difficulty: savedDifficulty } = loadGameFromLocalStorage();
    if (savedBoard && savedDifficulty) {
      setBoard(savedBoard);
      setDifficulty(savedDifficulty as 'easy' | 'medium' | 'hard');
      setIsModalOpen(false);
    } else {
      generatePuzzle('easy');
      setIsModalOpen(true);
    }
  }, []);

const handleCellChange = (row: number, col: number, value: number | null) => {
  if (value !== null && !isValidPlacement(board, row, col, value)) {
    toast.error("Invalid move!", {
      autoClose: 3000,
    });
  }


  const updatedBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
              return { ...cell, value };
          }
          return cell;
      })
  );
  setBoard(updatedBoard);
  saveGameToLocalStorage(updatedBoard, difficulty);
};

const handleSolve = () => {

  if (!validateBoardUtil(board)) {
    toast.error("The board has conflicts! Please correct them before solving.", { autoClose: 3000 });
    return; 
  }

  const boardCopy = board.map(row => row.map(cell => ({ ...cell }))); 
  if (solveIncompleteBoard(boardCopy)) {
    const solvedBoard = boardCopy.map(row =>
      row.map(cell => ({ ...cell, editable: false }))
    );
    setBoard(solvedBoard);
    saveGameToLocalStorage(solvedBoard, difficulty);
    toast.success("Puzzle solved!", { autoClose: 2000 });
  } else {
    toast.error("No solution exists for this puzzle!", { autoClose: 2000 });
  }
};


const resetGame = () => {
  localStorage.removeItem('sudokuBoard');
  const completeBoard = generateCompleteBoard();
  const newBoard = removeCellsForPuzzle(completeBoard, difficulty); 
  setBoard(newBoard);
  saveGameToLocalStorage(newBoard, difficulty);

  toast.info("Game has been reset.", { autoClose: 2000 });
};

const validateBoard = () => {
  const isValid = validateBoardUtil(board); 
  alert(isValid ? "The solution is correct!" : "The solution is incorrect!");
};


const generatePuzzle = (selectedDifficulty: 'easy' | 'medium' | 'hard' = difficulty) => {
  const completeBoard = generateCompleteBoard();
  const newBoard = removeCellsForPuzzle(completeBoard, selectedDifficulty);
  setBoard(newBoard);
  saveGameToLocalStorage(newBoard, selectedDifficulty);
  toast.success("New puzzle generated!", { autoClose: 2000 });
};

const handleDifficultyChange = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
  setDifficulty(selectedDifficulty);
  generatePuzzle(selectedDifficulty); 
  setIsModalOpen(false); 
};
  return (
    
    <div  className='game'>
        <ToastContainer theme='dark' /> 
      <h1>Sudoku Game</h1>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectDifficulty={handleDifficultyChange}
      />
      <SudokuBoard board={board} onCellChange={handleCellChange} />
      <div className='btn'>
      <button onClick={validateBoard}>Check Solution</button> 
      <button onClick={()=>setIsModalOpen(true)}>Generate New Puzzle</button> {/* New button */}
      <button onClick={resetGame}>Reset </button> {/* New button */}
      <button onClick={handleSolve}>Solve</button> {/* New Solve button */}
      </div>
    </div>
  );
};

export default App;
