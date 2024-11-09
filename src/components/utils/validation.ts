import { Board } from '../../type'

export const isValidPlacement = (board: Board, row: number, col: number, num: number | null): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
        if (c !== col && board[row][c].value === num) { 
            return false;
        }
    }

    // Check column
    for (let r = 0; r < 9; r++) {
        if (r !== row && board[r][col].value === num) { 
            return false;
        }
    }

    // Check 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if ((r !== row || c !== col) && board[r][c].value === num) { 
                return false;
            }
        }
    }

    return true;
};

export const validateBoard = (board: Board): boolean => {
    let isValid = true;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col].value !== null && !isValidPlacement(board, row, col, board[row][col].value)) {
                isValid = false;
                break;
            }
        }
    }
    return isValid;
};
