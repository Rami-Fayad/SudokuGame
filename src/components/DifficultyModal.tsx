import React from 'react';
import '../styles/Modal.css' 
import logo from '../assets/NavyBits Lebanon.png';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSelectDifficulty }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <img src={logo} alt="NavyBits Logo" className="modal-logo" />
        <h2>Select Difficulty</h2>
        <div className="difficulty-buttons">
          <button onClick={() => { onSelectDifficulty('easy'); onClose(); }}>Easy</button>
          <button onClick={() => { onSelectDifficulty('medium'); onClose(); }}>Medium</button>
          <button onClick={() => { onSelectDifficulty('hard'); onClose(); }}>Hard</button>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
