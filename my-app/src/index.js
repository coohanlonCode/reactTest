import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// "Functional" component that only has props args and does not extend Component.
// This should be used when the ONLY function you need is render(). 'class" becomes 'function'
function Square(props) {
      return ( // implied to be the 'render' method
        <button
            className="square"
            onClick={props.onClick} // note: does not have parentheses bc it looks to a reference/props variable
        >
            {props.value}
        </button>
        );
}

class Board extends React.Component {

  renderSquare(i) {
    // "Passing a prop from this Board component to Square component
    return (<Square
             value={this.props.squares[i]} // value is a prop being passed down
             onClick={()=> this.props.onClick(i)} // here, onClick is a prop being passed down
            />);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props)
    this.state={
        history: [{
            squares: Array(9).fill(null),
        }],
        xIsNext: true,
    };
  }

  handleClick(i){
    const history = this.state.history;
    const mostRecentTurn = history[history.length -1]; // slice() with no args returns a copy
    const boardAtCurrentTurn = mostRecentTurn.squares.slice();

    // Early termination for performance: winner/end-of-game or spot taken
    if(calculateTurnResult(boardAtCurrentTurn) ||  boardAtCurrentTurn[i]){
        return;
    }

    boardAtCurrentTurn[i] = this.state.xIsNext ? 'X':'O';
    this.setState({
        history: history.concat( //Unlike the array push() method, concat() doesn’t mutate the original array, so we prefer it.
            [{ squares: boardAtCurrentTurn}]
        ),
        xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(moveCount){



  }


  render() {

    const history = this.state.history
    const currentBoardState = history[history.length -1]
    const resultText = calculateTurnResult(currentBoardState.squares);

    const status = resultText ? `${resultText}`: `Next player: ${ this.state.xIsNext ? 'X':'O'}`;

    const moves = history.map((step,move) =>{
        const description = move ? `Go to move # ${move}`:'Go to game start';
        return (<li key={move}><button onClick={() => this.jumpTo(move)}>{description}</button></li>)
    })

    return (
      <div className="game">
        <div className="game-board">

          <Board
            squares={currentBoardState.squares}
            onClick={(i)=>this.handleClick(i)}
            status = {status}/>

        </div>

        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateTurnResult(currentSquares) {
  const winningLines = [
    [0, 1, 2], // top across
    [3, 4, 5], // middle across
    [6, 7, 8], // bottom across
    [0, 3, 6], // left down
    [1, 4, 7], // middle down
    [2, 5, 8], // right down
    [0, 4, 8], // top left to bottom right diagonal
    [2, 4, 6], // top right to bottom left diagonal
  ];

  for (let i = 0; i < winningLines.length; i++) { // look at each winning line

    const [a, b, c] = winningLines[i]; // [a,b,c] refers to the box numbers declared above, ie [0,1,2],[1,4,7],etx

    // if the value at the provided combo if winning lines are the same, then that is the 3 in a row
    let hasWinner= false;
    if (currentSquares[a]
        && currentSquares[a] === currentSquares[b]
        && currentSquares[a] === currentSquares[c]) {

      hasWinner = true;
      return `Winner: ${currentSquares[a]}`;
    }

    let isDraw = !hasWinner && !currentSquares.includes(null);
    if(isDraw){
        return `Draw: No Winner`
    }
  }
  return null; // no winner
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
