import React, { useState, useEffect } from 'react';
import SudokuBoard from './components/Board';
import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { validateBoard as validateBoardUtil } from './components/utils/validation';
import Modal from './components/DifficultyModal';
import { loadGameFromLocalStorage } from './components/utils/storageUtils'; 
import './App.css';
import {useBoard} from '../hooks/useBoard';
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
    handleHint
    
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

const validateBoard = () => {
  const isValid = validateBoardUtil(board); 
  alert(isValid ? "The solution is correct!" : "The solution is incorrect!");
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
      <button onClick={handleHint}>Hint</button> {/* Add the Hint button */}
      </div>
    </div>
  );
};

export default App;
