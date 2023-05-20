import React, { useEffect, useState } from "react";
import { nextAiMoves } from "./api/assetApi";

const TicTacToe = () => {
  const ai = "X";
  const human = "O";
  const [currentPlayer, setCurrentPlayer] = useState(human);
  const [result, setResult] = useState("");
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [countdown, setCountdown] = useState(3);
  const [first,setFirst] = useState("human")

  const startReloadCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      window.location.reload();
    }, countdown * 1000);
  };

  const handleAiFirst = async () => {
    setFirst("ai")
    const res = await nextAiMoves({ board });
    console.log(res.data.board);

    // Update the state with the new board from backend
    setBoard(res.data.board);
  };

  const handleClick = async (row, col) => {
    // Check if the clicked cell is empty
    if (board[row][col] === "") {
      // Create a new copy of the board
      const newBoard = [...board];
      // Update the clicked cell with the current player's symbol (X or O)
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);
      let resultWinner = checkWinner();
      // human click
      if (resultWinner != null) {
        if (resultWinner === "tie") {
          setResult("Draw");
        } else {
          setResult(`${resultWinner} wins!!`);
        }
        startReloadCountdown();
      } else {
        // send api
        const res = await nextAiMoves({ board });
        // Update the state with the new board from backend
        setBoard(res.data.board);
        let resultWinner = res.data.resultWinner;

        if (resultWinner != null) {
          if (resultWinner === "tie") {
            setResult("Draw");
          } else {
            setResult(`${resultWinner} wins!!`);
          }
          startReloadCountdown();
        }
      }
    }
  };

  function equals3(a, b, c) {
    return a == b && b == c && a != "";
  }

  function checkWinner() {
    let winner = null;

    // horizontal
    for (let i = 0; i < 3; i++) {
      if (equals3(board[i][0], board[i][1], board[i][2])) {
        winner = board[i][0];
      }
    }

    // Vertical
    for (let i = 0; i < 3; i++) {
      if (equals3(board[0][i], board[1][i], board[2][i])) {
        winner = board[0][i];
      }
    }

    // Diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
      winner = board[0][0];
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
      winner = board[2][0];
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "") {
          openSpots++;
        }
      }
    }

    if (winner == null && openSpots == 0) {
      return "tie";
    } else {
      return winner;
    }
  }

  useEffect(() => {}, [board]);

  return (
    <div className="container mx-auto mt-8">
      <button
        onClick={handleAiFirst}
        className={`  ${first === "ai" ?"bg-blue-500 hover:bg-blue-700":"bg-gray-500 hover:bg-gray-700"} text-white font-bold py-2 px-4 rounded`}
      >
        ai first
      </button>
      <div className="grid grid-cols-3 border-2 border-black">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="bg-gray-200 h-16 flex items-center justify-center text-4xl cursor-pointer border-2 border-black"
              onClick={() => handleClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))
        )}
      </div>

      {result && (
        <div
          className={`text-6xl ${
            result === "X wins!!" ? "text-green-700" : "text-red-700"
          }`}
        >
          {result}
        </div>
      )}

      {countdown < 3 && (
        <div className="text-4xl text-gray-500">
          Reloading in {countdown} seconds
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
