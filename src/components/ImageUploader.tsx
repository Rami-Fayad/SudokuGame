import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

interface ImageUploaderProps {
  onNumbersRecognized: (numbers: (number | null)[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onNumbersRecognized }) => {
  const [loading, setLoading] = useState(false);

  const processCellImage = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, size: number): Promise<string> => {
    const cellCanvas = document.createElement('canvas');
    const cellCtx = cellCanvas.getContext('2d');
    cellCanvas.width = size;
    cellCanvas.height = size;

    cellCtx?.drawImage(canvas, x, y, size, size, 0, 0, size, size);

    // Convert to grayscale and apply binarization
    const cellImageData = cellCtx?.getImageData(0, 0, size, size);
    const data = cellImageData?.data;

    if (data) {
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const threshold = avg > 128 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = threshold;
      }
      cellCtx?.putImageData(cellImageData, 0, 0);
    }

    return cellCanvas.toDataURL();
  };

  const preprocessAndRecognizeCells = async (file: File) => {
    return new Promise<number[]>((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 550;
        canvas.height = 550;
        ctx?.drawImage(img, 0, 0, 550, 550);

        const cellSize = 550 / 9;
        const recognizedNumbers: (number | null)[] = Array(81).fill(null);

        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            const cellImage = await processCellImage(canvas, ctx!, col * cellSize, row * cellSize, cellSize);
            
            try {
              const result = await Tesseract.recognize(cellImage, 'eng', {
                tessedit_char_whitelist: '123456789',
                tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR, // Focus on single character
              });

              const number = parseInt(result.data.text.trim(), 10);
              if (!isNaN(number) && number >= 1 && number <= 9) {
                recognizedNumbers[row * 9 + col] = number;
              }
            } catch (error) {
              console.error("Error recognizing number in cell:", error);
            }
          }
        }

        resolve(recognizedNumbers);
      };
      img.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);

      try {
        const recognizedNumbers = await preprocessAndRecognizeCells(file);
        onNumbersRecognized(recognizedNumbers);
        toast.success("Numbers recognized and placed on the board!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to recognize numbers from the image.");
      } finally {
        setLoading(false);
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
      {loading && <Spinner />}
    </div>
  );
};

export default ImageUploader;
