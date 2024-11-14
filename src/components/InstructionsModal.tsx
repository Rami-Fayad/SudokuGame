import React from 'react';
import '../styles/Modal.css';
import logo from '../assets/NavyBits Lebanon.png';
interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <img src={logo} alt="NavyBits Logo" className="modal-logo" />
        <h2>How to Play Sudoku</h2>
        <p>
          Sudoku is a game of logic. The objective is to fill a 9x9 grid so that each column, each row,
          and each of the nine 3x3 grids contains all digits from 1 to 9 without repetition.
        </p>
        <ul>
          <li>Choose a difficulty level to start a new game.</li>
          <li>Click on a cell to select it and input a number.</li>
          <li>Use hints or solve the puzzle if you're stuck.</li>
        </ul>
        <p>
          You can also explore puzzles on{' '}
          <a
            href="https://sudoku.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#00aaff', textDecoration: 'underline' }}
          >
            sudoku.com
          </a>{' '}
          to try scanning and playing them here!
        </p>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default InstructionsModal;
