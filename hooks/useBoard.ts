import { useState } from 'react';
import { Board as BoardType } from '../src/type'
import { isValidPlacement, validateBoard as validateBoardUtil } from '../src/components/utils/validation';
import { generateCompleteBoard } from '../src/components/utils/generator';
import { saveGameToLocalStorage } from '../src/components/utils/storageUtils';
import { removeCellsForPuzzle ,createInitialBoard} from '../src/components/utils/boardUtils';
import { solveIncompleteBoard } from '../src/components/utils/solver';
import { toast } from 'react-toastify';

export const useBoard = (difficulty: 'easy' | 'medium' | 'hard') => {
  const [board, setBoard] = useState<BoardType>(createInitialBoard());
  const [isSuccessModalOpen, setIsSuccessModalOpen] =useState<boolean>(false);

  const handleCellChange = (row: number, col: number, value: number | null) => {
    
    if (value !== null && !isValidPlacement(board, row, col, value)) {
      toast.error("Invalid move!", { autoClose: 3000 });
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
    if (isBoardSolved(updatedBoard))
        setIsSuccessModalOpen(true);
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

  const generatePuzzle = (selectedDifficulty: 'easy' | 'medium' | 'hard' = difficulty) => {
    const completeBoard = generateCompleteBoard();
    const newBoard = removeCellsForPuzzle(completeBoard, selectedDifficulty);
    setBoard(newBoard);
    saveGameToLocalStorage(newBoard, selectedDifficulty);
    toast.success("New puzzle generated!", { autoClose: 2000 });
  };

  const handleHint = () => {
    // Validate if the board is in a valid state before proceeding
    if (!validateBoardUtil(board)) {
      toast.error("The board has conflicts! Please correct them before taking a hint.", { autoClose: 3000 });
      return;
    }
  
    // Create a copy of the board to work with (we'll modify this copy)
    const boardCopy = board.map(row => row.map(cell => ({ ...cell })));
  
    // Loop through the board and find the first empty cell that is editable
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col].value === null && board[row][col].editable) {
  
          // Try placing each number from 1 to 9 to check if it is valid and solves the board
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(boardCopy, row, col, num)) {
              
              // Place the number in the copied board and check if it's solvable
              boardCopy[row][col].value = num;
  
              // Check if the board is still solvable after placing the number
              if (solveIncompleteBoard(boardCopy)) {
                // If solvable, update the actual board and show the hint
                const updatedBoard = board.map((r, rowIndex) =>
                  r.map((cell, colIndex) => {
                    if (rowIndex === row && colIndex === col) {
                      return { ...cell, value: num };  // Place the hint value
                    }
                    return cell;
                  })
                );
  
                setBoard(updatedBoard);
                saveGameToLocalStorage(updatedBoard, difficulty);
                toast.info(`Hint: Try ${num} at (${row + 1}, ${col + 1})`, { autoClose: 3000 });
                if (isBoardSolved(updatedBoard))
                    setIsSuccessModalOpen(true);
                return;  // Stop after providing one valid hint
              }
  
              // If placing this number doesn't solve the puzzle, reset it
              boardCopy[row][col].value = null;
            }
          }
        }
      }
    }
  
    // If no valid hints are found (should not happen if the puzzle is solvable)
    toast.error("No valid hints found!");
  };
  
  const isBoardSolved = (board: BoardType) => {
    // Check that every cell is filled (no `null` values)
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col].value === null) {
          return false; // Incomplete board
        }
      }
    }
  
   
    return validateBoardUtil(board);
  };

  return {
    board,
    setBoard,
    handleCellChange,
    handleSolve,
    resetGame,
    generatePuzzle,
    handleHint,
    isBoardSolved,
    isSuccessModalOpen,
    setIsSuccessModalOpen

  };
};


