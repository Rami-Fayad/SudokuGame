import React from 'react'
interface Buttonprobs {
oncheck : ()=> void ;
onnewpuzzle: ()=> void;
onreset: () => void;
onsolve: () => void;
onhint : () => void;
onShowInstructions : () => void;

}

const Buttons : React.FC<Buttonprobs>  = ({oncheck , onnewpuzzle ,onreset , onsolve , onhint , onShowInstructions}) => {
  return (

    <div className='btn'>
        
    <button onClick={oncheck}>Check </button> 
    <button onClick={  onnewpuzzle}> New Puzzle</button> 
    <button onClick={onreset}>Reset </button>
    <button onClick={onsolve}>Solve</button> 
    <button onClick={onhint}>Hint</button> 
    <button onClick={onShowInstructions}>Instructions</button> 
    </div>
  )
}

export default Buttons