import React from 'react'
import logo from '../assets/NavyBits Lebanon.png';
import { useEffect ,useRef } from 'react';
interface SuccesModalProps {
    isopen:boolean,
    onClose:()=> void;
    hintCount : number;
}
const ResultModal:React.FC<SuccesModalProps> = ({isopen, onClose, hintCount}) => {
  const audioRef = useRef(new Audio('./winning-218995.mp3'));

    useEffect(() => {
        if (isopen) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

    }, [isopen]);
    if(!isopen) return null;
 
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
      <img src={logo} alt="NavyBits Logo" className="modal-logo" />
        <h2>Congratulations!</h2>
        <p>You’ve successfully solved the puzzle!</p>
        <p>Hints used: {hintCount}</p>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default ResultModal