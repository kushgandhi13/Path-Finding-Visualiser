import React from "react";
import "./Node.css";

export default function Node({row,col,isFinish,isStart,isWall,onMouseDown,onMouseEnter,onMouseUp,isWeight})
{
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWall
      ? "node-wall"
      : isWeight
      ? "node-weight"
      : "";

    return (
      <td
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></td> // It is used to create the grid.
    );
}