export interface Cell {
    value: number | null;  
    editable: boolean;   //  :) Rami 
  }
  
  export type Board = Cell[][]; // A 9x9 grid of cells

  