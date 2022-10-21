import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
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
        onClick={() => {
          this.props.onClick(i);
        }}
      />
    );
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
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      chorusRules: false,
      beenClicked: [false, null],
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)) {
      return;
    }
    //Check if chorusRules have already been implemented to avoid redundancy
    if (this.state.chorusRules === false) {
      if (squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        chorusRules: hasThreeSymbols(squares),
      });
    }
    //Playing in chorusRules
    else {
      //Checking if middle spot is occupied
      if (squares[4] != null) {
        if (
          (squares[4] == "X" && this.state.xIsNext) ||
          (squares[4] == "O" && !this.state.xIsNext)
        ) {
          console.log("Please move center next turn or lose");
        }
      }
      //Haven't selected symbol yet
      if (this.state.beenClicked[0] === false) {
        //Checks that symbol selected is valid
        if (
          (!this.state.xIsNext && squares[i] === "X") ||
          (this.state.xIsNext && squares[i] == "O") ||
          squares[i] == null
        ) {
          return;
        }
        //tells us it has been clicked)
        this.state.beenClicked[0] = true;
        //what index was the target div
        this.state.beenClicked[1] = i;
        return;
      } else {
        //If symbol has been selected, check if move is valid
        if (isValid(squares, this.state.beenClicked[1], i)) {
          if (
            (squares[4] == "X" && this.state.xIsNext) ||
            (squares[4] == "O" && !this.state.xIsNext)
          ) {
          }
          squares[i] = this.state.xIsNext ? "X" : "O";
          squares[this.state.beenClicked[1]] = null;
          this.setState({
            beenClicked: [false, null],
          });
        } else {
          this.setState({
            beenClicked: [false, null],
          });
          return;
        }
      }
    }
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => {
              this.jumpTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// Helper Function
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
//Helper Function to determine if array has 3 Xs and Os
function hasThreeSymbols(inputArray) {
  let xCounter = 0;
  let oCounter = 0;
  inputArray.forEach((element) => {
    if (element === "X") {
      xCounter += 1;
    } else if (element === "O") {
      oCounter += 1;
    }
  });
  if (xCounter === 3 && oCounter === 3) {
    return true;
  } else {
    return false;
  }
}

function isValid(inputArray, start, end) {
  if (inputArray[end] == "X" || inputArray[end] == "O") {
    return false;
  }

  //Array of valid moves in syntax moves[0] gives all valid spots for 0
  const moves = [
    [1, 3, 4],
    [0, 2, 3, 4, 5],
    [1, 4, 5],
    [0, 1, 4, 6, 7],
    [0, 1, 2, 3, 5, 6, 7, 8],
    [1, 2, 4, 7, 8],
    [3, 4, 7],
    [3, 4, 5, 6, 8],
    [4, 5, 7],
  ];
  console.log(moves[start]);
  if (moves[start].includes(end)) {
    return true;
  } else {
    return false;
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
