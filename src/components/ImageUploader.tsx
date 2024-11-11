import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

interface ImageUploaderProps {
  onNumbersRecognized: (numbers: (number | null)[]) => void; // Callback to pass recognized numbers
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onNumbersRecognized }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const imageUrl = URL.createObjectURL(file);
      
      // Use Tesseract.js to recognize text from the image
      const result = await Tesseract.recognize(imageUrl, 'eng', {
        logger: (m) => console.log(m), // Optional: log progress
      });
      
      // Extract recognized numbers and their positions
      const recognizedNumbers: (number | null)[] = Array(81).fill(null); // Initialize an empty board
      const text = result.data.text;
      const words = result.data.words; // Get words with their bounding boxes

      // Map recognized numbers to their positions
      words.forEach((word) => {
        const number = parseInt(word.text, 10);
        if (!isNaN(number) && number >= 1 && number <= 9) {
          const x = Math.floor((word.bbox.x0 + word.bbox.x1) / 2);
          const y = Math.floor((word.bbox.y0 + word.bbox.y1) / 2);
          const rowIndex = Math.floor(y / (558 / 9)); // Calculate row index
          const colIndex = Math.floor(x / (571 / 9)); // Calculate column index
          
          if (rowIndex < 9 && colIndex < 9) {
            recognizedNumbers[rowIndex * 9 + colIndex] = number; // Place number in the correct position
          }
        }
      });

      // Log the recognized numbers for debugging
      console.log("Recognized Numbers:", recognizedNumbers);

      onNumbersRecognized(recognizedNumbers); // Pass recognized numbers to the parent
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {loading && <p>Recognizing numbers...</p>}
    </div>
  );
};

export default ImageUploader;
