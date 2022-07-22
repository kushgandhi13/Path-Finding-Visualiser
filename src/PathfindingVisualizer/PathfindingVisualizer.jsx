import React, { useState, useEffect } from "react";

import Node from "./Node/Node.jsx";
import { showPopUp } from "./Tutorial/Tutorial.jsx";

import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

import "./PathfindingVisualizer.css";

// Defining initial state of start and finish.

let row_max_length = 20;
let col_max_length = 44;

let START_NODE_ROW = 9;
let START_NODE_COL = 8;
let FINISH_NODE_ROW = 9;
let FINISH_NODE_COL = 31;

export default function PathfindingVisualizer(props) {
  const [visulizerState, setVisulizerState] = useState({
    grid: [],
    mouseIsPressed: false,
    topMessage: "Dijkstra Algorithm",
    weight: 1,
    changeWeight: false,
    distanceToBeTraveled: 0,
  });

  //Create Node
  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      isWeight: false,
      previousNode: null,
      weight: 0,
    };
  };

  // Get Initial Grid
  const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < row_max_length; row++) {
      const currentRow = [];
      for (let col = 0; col < col_max_length; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  // Creating grid
  useEffect(() => {
    const grid = getInitialGrid();
    setVisulizerState({ ...visulizerState, grid });
    // eslint-disable-next-line
  }, []);

  // Get New grid with toggled weight
  const getNewGridWithWeightToggled = (grid, row, col, weight) => {
    const newGrid = [...grid];
    const node = newGrid[row][col];
    const newNode = {
      ...node, // copying other properties of the node
      isWeight: !node.isWeight,
      weight: parseInt(weight),
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  function getNewGridWithWallToggled(grid, row, col) {
    const newGrid = [...grid];
    const node = newGrid[row][col];
    const newNode = {
      ...node, // copying other properties of the node
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  // On pressing the mouse down
  function handleMouseDown(row, col) {
    if (visulizerState.topMessage !== "Dijkstra Algorithm") return;

    let newGrid = [];

    if (visulizerState.changeWeight) {
      newGrid = getNewGridWithWeightToggled(
        visulizerState.grid,
        row,
        col,
        visulizerState.weight
      );
    } else {
      newGrid = getNewGridWithWallToggled(visulizerState.grid, row, col);
    }

    setVisulizerState({
      ...visulizerState,
      grid: newGrid,
      mouseIsPressed: true,
    });
  }

  // On entering the new node element.
  function handleMouseEnter(row, col) {
    if (visulizerState.topMessage !== "Dijkstra Algorithm") return;
    if (!visulizerState.mouseIsPressed) return;

    let newGrid = [];

    if (visulizerState.changeWeight) {
      newGrid = getNewGridWithWeightToggled(
        visulizerState.grid,
        row,
        col,
        visulizerState.weight
      );
    } else {
      newGrid = getNewGridWithWallToggled(visulizerState.grid, row, col);
    }

    setVisulizerState({
      ...visulizerState,
      grid: newGrid,
      mouseIsPressed: true,
    });
  }

  // When we release the mouse
  function handleMouseUp() {
    if (visulizerState.topMessage !== "Dijkstra Algorithm") return;
    setVisulizerState({ ...visulizerState, mouseIsPressed: false });
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    let timeTaken = 0;
    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (nodesInShortestPathOrder[i].isWeight) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-path-weight";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-path";
        }
      }, 50 * i);
    }

    timeTaken =
      nodesInShortestPathOrder[nodesInShortestPathOrder.length - 1].distance;
    setVisulizerState({
      ...visulizerState,
      topMessage: "Shortest Path",
      distanceToBeTraveled: timeTaken,
    });
    return timeTaken;
  }

  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      let timeTaken = 0;
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          setVisulizerState({ ...visulizerState, topMessage: "Shortest Path" });
          timeTaken = animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return timeTaken;
      }

      if (i === visitedNodesInOrder.length - 1) continue;
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.isWeight) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visitedWeight";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 10 * i);
    }
  }

  function visualizeDijkstra() {
    setVisulizerState({ ...visulizerState, topMessage: "Creator : Manan & Kush" });
    const { grid } = visulizerState;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function notCorrect() {
    if (
      isNaN(parseInt(document.getElementById("start_row").value)) ||
      isNaN(parseInt(document.getElementById("start_col").value)) ||
      isNaN(parseInt(document.getElementById("end_row").value)) ||
      isNaN(parseInt(document.getElementById("end_col").value))
    )
      return true;

    if (
      parseInt(document.getElementById("start_row").value) > row_max_length ||
      parseInt(document.getElementById("start_col").value) > col_max_length
    )
      return true;
    if (
      parseInt(document.getElementById("start_row").value) < 0 ||
      parseInt(document.getElementById("start_col").value) < 0
    )
      return true;

    if (
      parseInt(document.getElementById("end_row").value) > row_max_length ||
      parseInt(document.getElementById("end_col").value) > col_max_length
    )
      return true;
    if (
      parseInt(document.getElementById("end_row").value) < 0 ||
      parseInt(document.getElementById("end_col").value) < 0
    )
      return true;

    return false;
  }

  function weightChangeHandler(event) {
    setVisulizerState({ ...visulizerState, weight: event.target.value });
  }

  function pointChangeHandler() {
    if (notCorrect()) return; //To check if the provided value is suitable or not.

    document.getElementById(
      `node-${START_NODE_ROW}-${START_NODE_COL}`
    ).className = "node";
    document.getElementById(
      `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
    ).className = "node";

    START_NODE_ROW = parseInt(document.getElementById("start_row").value);
    START_NODE_COL = parseInt(document.getElementById("start_col").value);
    FINISH_NODE_ROW = parseInt(document.getElementById("end_row").value);
    FINISH_NODE_COL = parseInt(document.getElementById("end_col").value);

    document.getElementById(
      `node-${START_NODE_ROW}-${START_NODE_COL}`
    ).className = "node node-start";
    document.getElementById(
      `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
    ).className = "node node-finish";
  }

  function toggleWeight() {
    const temp = visulizerState.changeWeight;
    setVisulizerState({ ...visulizerState, changeWeight: !temp });
  }

  const {
    grid,
    mouseIsPressed,
    topMessage,
    changeWeight,
    distanceToBeTraveled,
  } = visulizerState;

  return (
    <div className="pathfindingVisualizer">
      <div className="container">
        <div className="heading">
          <h2 onClick={showPopUp}>Path Finding Visualizer</h2>
          <h2>{topMessage}</h2>
        </div>

        {/* Show the header */}
        <TextBox
          topMessage={topMessage}
          distanceToBeTraveled={distanceToBeTraveled}
          visualizeDijkstra={visualizeDijkstra}
          weightChangeHandler={weightChangeHandler}
          pointChangeHandler={pointChangeHandler}
          toggleWeight={toggleWeight}
          changeWeight={changeWeight}
          setVisulizerState={setVisulizerState}
        />

        <p>
          Dijkstra's Algorithm determines the shortest path in a weighted directed and undirected Graph with non-negative weights! {" "}
          <a style = {{color:"#51E9DE"}} target = "_blank" href="https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-using-priority_queue-stl/">Check this out for better understanding </a>
          <span className="ref"></span>
        </p>
      </div>

      <div className="visualGridContainer">
        <div className="gridBox">
          <table className="grid" style={{ borderSpacing: "0" }}>
            <tbody>
              {grid.map((row, rowIndex) => {
                return (
                  <tr key={rowIndex}>
                    {row.map((node, nodeIndex) => {
                      const { isStart, isFinish, isWall, isWeight } = node; //Extracting from the node
                      return (
                        <Node
                          row={rowIndex}
                          col={nodeIndex}
                          key={rowIndex + "-" + nodeIndex}
                          isStart={isStart}
                          isFinish={isFinish}
                          isWall={isWall}
                          isWeight={isWeight}
                          mouseIsPressed={mouseIsPressed}
                          onMouseDown={(row, col) => handleMouseDown(row, col)}
                          onMouseEnter={(row, col) =>
                            handleMouseEnter(row, col)
                          }
                          onMouseUp={() => handleMouseUp()}
                        ></Node>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ButtonTask({
  topMessage,
  visualizeDijkstra,
  distanceToBeTraveled,
  setVisulizerState,
}) {
  console.log(topMessage);
  function handleReset() {
    setVisulizerState({
      grid: [],
      mouseIsPressed: false,
      topMessage: "Dijkstra Algorithm",
      weight: 1,
      changeWeight: false,
      distanceToBeTraveled: 0,
    });
    window.location.reload(false);
  }

  if (topMessage === "Shortest Path") {
    return (
      <h2 className="btn" href="#" onClick={() => handleReset()}>
        Reset <br />
        Time : {distanceToBeTraveled}
        <small> [1 Block = 1 Time = 1 Weight]</small>
      </h2>
    );
  }

  if (topMessage === "Creator : Manan & Kush") {
    return <h3 className="running">Running...</h3>;
  }

  return (
    <p className="btn" onClick={() => visualizeDijkstra()}>
      Start Dijkstra Algorithm
    </p>
  );
}

function TextBox({
  topMessage,
  distanceToBeTraveled,
  visualizeDijkstra,
  weightChangeHandler,
  pointChangeHandler,
  toggleWeight,
  changeWeight,
  setVisulizerState,
}) {
  if (topMessage === "Creator : Manan & Kush") return null;

  if (topMessage === "Shortest Path") {
    return (
      <div
        className="buttonContainer"
        style={{ width: "30%", margin: "0 auto" }}
      >
        <ButtonTask
          topMessage={topMessage}
          visualizeDijkstra={visualizeDijkstra}
          distanceToBeTraveled={distanceToBeTraveled}
          setVisulizerState={setVisulizerState}
        />
      </div>
    );
  }

  return (
    <div className="textBox">
      <div className="weightContainer">
        <label htmlFor="quantity">Toggle or Set Weight </label>

        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          max="5"
          onChange={weightChangeHandler}
          defaultValue="1"
        />

        <button onClick={toggleWeight}>
          {changeWeight ? "True" : "False"}
        </button>
      </div>

      <div className="startPointContainer">
        <label htmlFor="point">Start Point :</label>
        <input
          type="number"
          name="point"
          id="start_row"
          min="0"
          max={row_max_length - 1}
          onChange={pointChangeHandler}
          defaultValue="9"
        ></input>
        <input
          type="number"
          name="point"
          id="start_col"
          min="0"
          max={col_max_length - 1}
          onChange={pointChangeHandler}
          defaultValue="8"
        ></input>
      </div>

      <div className="endPointContainer">
        <label htmlFor="point">End Point :</label>
        <input
          type="number"
          name="point"
          id="end_row"
          min="0"
          max={row_max_length - 1}
          onChange={pointChangeHandler}
          defaultValue="9"
        ></input>
        <input
          type="number"
          name="point"
          id="end_col"
          min="0"
          max={col_max_length - 1}
          onChange={pointChangeHandler}
          defaultValue="31"
        ></input>
      </div>

      <div className="buttonContainer">
        <ButtonTask
          topMessage={topMessage}
          visualizeDijkstra={visualizeDijkstra}
          distanceToBeTraveled={distanceToBeTraveled}
        />
      </div>
    </div>
  );
}
