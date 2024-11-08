import { Board as BoardType } from '../../type';

export const saveGameToLocalStorage = (board: BoardType, difficulty: string) => {
  localStorage.setItem('sudokuBoard', JSON.stringify(board));
  localStorage.setItem('sudokuDifficulty', difficulty);
};

export const loadGameFromLocalStorage = (): { board: BoardType | null; difficulty: string | null } => {
  const savedBoard = localStorage.getItem('sudokuBoard');
  const savedDifficulty = localStorage.getItem('sudokuDifficulty');
  return {
    board: savedBoard ? JSON.parse(savedBoard) : null,
    difficulty: savedDifficulty || 'easy',
  };
};
