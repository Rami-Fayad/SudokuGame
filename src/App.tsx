import React, { useState, useEffect } from 'react';
import SudokuBoard from './components/Board';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import Modal from './components/DifficultyModal';
import { loadGameFromLocalStorage } from './components/utils/storageUtils'; 
import ImageUploader from './components/ImageUploader';
import './App.css';
import {useBoard} from '../hooks/useBoard';
import ResultModal from './components/ResultModal';

const App: React.FC = () => {
  
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); 


  const {
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
    
  } = useBoard(difficulty);

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
  
  const handleNumbersRecognized = (numbers: (number | null)[]) => {
    const updatedBoard = board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const index = rowIndex * 9 + colIndex; // Calculate the index in the flat array
        const value = numbers[index];
        return { 
          ...cell, 
          value: value || null, 
          editable: value === null // Make cells editable only if the value is null
        };
      })
    );
    setBoard(updatedBoard);
    toast.success("Numbers recognized and placed on the board!", { autoClose: 3000 });
  };
  
  

 
const validateBoard = () => {
  
  const issolved = isBoardSolved(board);
  
  if (issolved)

    setIsSuccessModalOpen(true);
  else
  toast.error('The solution is in correct or incomplete')
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
      <ResultModal
        isopen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          
        />
        <ImageUploader onNumbersRecognized={handleNumbersRecognized} />
      <SudokuBoard board={board} onCellChange={handleCellChange} />
      
      <div className='btn'>
        
      <button onClick={validateBoard}>Check Solution</button> 
      <button onClick={()=>setIsModalOpen(true)}>Generate New Puzzle</button> {/* New button */}
      <button onClick={resetGame}>Reset </button> {/* New button */}
      <button onClick={handleSolve}>Solve</button> {/* New Solve button */}
      <button onClick={handleHint}>Hint</button> {/* Add the Hint button */}
      
      </div>
    </div>
  );
};

export default App;
