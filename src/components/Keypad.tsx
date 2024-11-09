// src/components/Keypad.tsx
import React from 'react';
import '../styles/Keypad.css';

interface KeypadProps {
  onSelect: (value: number | null) => void;
}

const Keypad: React.FC<KeypadProps> = ({ onSelect }) => {
  return (
    <div className="keypad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button key={num} onClick={() => onSelect(num)}>
          {num}
        </button>
      ))}
      <button onClick={() => onSelect(null)}>Clear</button>
    </div>
  );
};

export default Keypad;
