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
import InstructionsModal from './components/InstructionsModal';
import Buttons from './components/Buttons';

 const App: React.FC = () => {
  
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); 
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState<boolean>(false); 


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
    setIsSuccessModalOpen,
   
 
    
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
        const index = rowIndex * 9 + colIndex;
        const value = numbers[index];
        return { 
          ...cell, 
          value: value || null, 
          editable: value === null 
        };
      })
    );
    setBoard(updatedBoard);
  };
  
const validateBoard = () => {
  
  const issolved = isBoardSolved(board);
  
  if (issolved)

    setIsSuccessModalOpen(true);
  else
  toast.error('The solution is in correct or incomplete')
  const audio = new Audio('./Wrong.wav') ;
  audio.play();
};

const handleDifficultyChange = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
  setDifficulty(selectedDifficulty);
  generatePuzzle(selectedDifficulty); 
  setIsModalOpen(false); 
};


  return (
    <div>
    <img src="./NavyBits Lebanon.png" alt="" className='navy-logo' />
    <div  className='game'>
    <h1>Sudoku Game</h1>

    <ToastContainer theme='dark' /> 
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectDifficulty={handleDifficultyChange}
      />
      <ResultModal
        isopen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
      />
       <InstructionsModal
          isOpen={isInstructionsModalOpen}
          onClose={() => setIsInstructionsModalOpen(false)}
        />
      <SudokuBoard board={board} onCellChange={handleCellChange} />
      <Buttons
      oncheck = {validateBoard}
      onnewpuzzle = {()=>setIsModalOpen(true)}
      onreset = {resetGame}
      onsolve = {handleSolve}
      onhint = {handleHint}
      onShowInstructions = {()=>setIsInstructionsModalOpen(true)}
      />
       
      <div className='image-uploader-container'>
    <h3>Upload Sudoku Image</h3>
    <ImageUploader onNumbersRecognized={handleNumbersRecognized} />
  </div>
    </div>
    </div>
  );
};

export default App;
