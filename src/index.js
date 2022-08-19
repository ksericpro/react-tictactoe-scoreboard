import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function ScoreBoard(props) {
    console.log("[ScoreBoard] is rendering");
    return (
      <div>
        <div className="overall-score">
          X-<span>{props.total_x}</span> &nbsp; &nbsp;O-<span>{props.total_o}</span>
        </div>
        <br/>
        <button onClick={props.onClick}>RESET SCORE</button>
      </div>
    );
}

function Square(props) {
  console.log("[Square] is rendering");
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    console.log("[Board] is rendering");
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
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      total_o: 0,
      total_x: 0,
    };
  }


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  resetGame(total_o, total_x){
     console.log("[resetGame]: is resetting current game");
     console.log(`[resetGame]: total_o=${total_o}, total_x=${total_x}`);
     this.setState({
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      total_o: total_o,
      total_x: total_x,
    });
  }

  resetScore(){
     console.log("[resetScore] is resetting score");
     this.setState({
        total_o: 0,
        total_x: 0,
      });
  }

  render() {
    console.log("[Game] is rendering");
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    let total_o = this.state.total_o;
    let total_x = this.state.total_x;
    if (winner) {
      status = "Winner: " + winner;
      if (winner==="O") {
      //  console.log("winner is O")
        total_o++;
      } else if (winner==="X"){
       // console.log("winner is X")
        total_x++;
      }
      console.log(`[Game]:winner='${winner}', total_o=${total_o}, total_x=${total_x}`);
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
          <br/>
          <button onClick={()=>this.resetGame(total_o, total_x)}>RESET GAME</button>
     
          <ScoreBoard total_o={total_o} total_x={total_x} onClick={()=>this.resetScore()}/>

        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}