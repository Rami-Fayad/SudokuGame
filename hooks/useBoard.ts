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
      const audio = new Audio('./Wrong.wav') ;
      audio.play();
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
      const audio = new Audio('./Wrong.wav') ;
      audio.play();
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
    const audio = new Audio('./generate.wav') ;
      audio.play();
  };

  const generatePuzzle = (selectedDifficulty: 'easy' | 'medium' | 'hard' = difficulty) => {
    const completeBoard = generateCompleteBoard();
    const newBoard = removeCellsForPuzzle(completeBoard, selectedDifficulty);
    setBoard(newBoard);
    saveGameToLocalStorage(newBoard, selectedDifficulty);
    toast.success("New puzzle generated!", { autoClose: 2000 });
    const audio = new Audio('./generate.wav') ;
      audio.play();
  };

  const handleHint = () => {
    if (!validateBoardUtil(board)) {
      toast.error("The board has conflicts! Please correct them before taking a hint.", { autoClose: 3000 });
      const audio = new Audio('./Wrong.wav') ;
      audio.play();
      return;
    }
    const boardCopy = board.map(row => row.map(cell => ({ ...cell })));
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col].value === null && board[row][col].editable) {
  
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(boardCopy, row, col, num)) {
              boardCopy[row][col].value = num;

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
              boardCopy[row][col].value = null;
            }
          }
        }
      }
    }
  
    toast.error("No valid hints found!");
  };
  


  const isBoardSolved = (board: BoardType) => {
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


