import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

interface ImageUploaderProps {
  onNumbersRecognized: (numbers: number[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onNumbersRecognized }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Preprocess each cell image for better OCR accuracy
  const processCellImage = (canvas: HTMLCanvasElement, x: number, y: number, size: number): string => {
    const cellCanvas = document.createElement('canvas');
    const cellCtx = cellCanvas.getContext('2d');
    cellCanvas.width = size;
    cellCanvas.height = size;

    cellCtx?.drawImage(canvas, x, y, size, size, 0, 0, size, size);

    // Convert to grayscale and increase contrast
    const cellData = cellCtx?.getImageData(0, 0, size, size);
    if (cellData) {
      const data = cellData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
        data[i] = data[i + 1] = data[i + 2] = gray > 128 ? 255 : 0; // Binarize
      }
      cellCtx?.putImageData(cellData, 0, 0);
    }

    return cellCanvas.toDataURL();
  };

  const recognizeCells = async (file: File): Promise<number[]> => {
    return new Promise<number[]>((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = Math.min(img.width, img.height); // Use square size
        canvas.width = size;
        canvas.height = size;
        ctx?.drawImage(img, 0, 0, size, size);

        const cellSize = size / 9;
        const recognizedNumbers: (number | null)[] = Array(81).fill(null);

        const promises = [];
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            const cellImage = processCellImage(canvas, col * cellSize, row * cellSize, cellSize);

            const promise = Tesseract.recognize(cellImage, 'eng', {
              logger: (info) => console.log(info), // Logs progress
            })
              .then((result) => {
                const number = parseInt(result.data.text.trim(), 10);
                recognizedNumbers[row * 9 + col] = !isNaN(number) && number >= 1 && number <= 9 ? number : null;
              })
              .catch((error) => {
                console.error(`Error recognizing number at row ${row}, col ${col}:`, error);
              });
            

            promises.push(promise);
          }
          setProgress(((row + 1) / 9) * 100);
        }

        await Promise.all(promises);
        resolve(recognizedNumbers.map((num) => num ?? 0)); // Map null to 0
      };

      img.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      setProgress(0);

      try {
        const recognizedNumbers = await recognizeCells(file);
        onNumbersRecognized(recognizedNumbers);
        toast.success("Numbers recognized and placed on the board!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to recognize numbers from the image.");
      } finally {
        setLoading(false);
        setProgress(0);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
      />
      {loading && (
        <div>
          <Spinner />
          <p>Processing... {Math.round(progress)}%</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
