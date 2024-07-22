import "./Board.css";

import Cell from "./Cell";
import React from "react";

const Board = ({ board, onClick }) => {
  return (
    <div className="board">
      {board.map((cell, index) => (
        <Cell key={index} value={cell} onClick={() => onClick(index)} />
      ))}
    </div>
  );
};

export default Board;
