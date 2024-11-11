import React from 'react'
import logo from '../assets/NavyBits Lebanon.png';
interface SuccesModalProps {
    isopen:boolean,
    onClose:()=> void;
}
const ResultModal:React.FC<SuccesModalProps> = ({isopen, onClose}) => {
    if(!isopen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <img src={logo} alt="NavyBits Logo" className="modal-logo" />
        <h2>Congratulations!</h2>
        <p>You’ve successfully solved the puzzle!</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default ResultModal