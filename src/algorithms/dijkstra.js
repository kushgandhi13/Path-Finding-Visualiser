//Here is the implementation of Dijkstra algorithm which is a weighted algorithm,weights are non-negative in this algorithm.

export function dijkstra(grid, startNode, endNode) 
{
  const visitedNodesInOrder = []; // To animate visited nodes in order to animate the process of searching.
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) 
  {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    //On encountering walls we skip it 
    if (closestNode.isWall) 
      continue; 

    //If the closest distance is Infinity which means our target node is blocked from all sides so we will stop and return.
    if (closestNode.distance === Infinity) 
      return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Checking for the success condition.
    if (closestNode === endNode) 
      return visitedNodesInOrder;

    updateUnvisitedNeighbors(closestNode, grid);
  }
}

// Sorts the unvisitedNodes every time it is called.
function sortNodesByDistance(unvisitedNodes) 
{
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// Sets the neighbour nodes distance and also the previous node property.
function updateUnvisitedNeighbors(node, grid) 
{
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) 
  {
    
    neighbor.distance = node.distance + neighbor.weight + 1; 
    // Now the neighbor distance is not infinity and because of it will show among the top in unvisited nodes.
    neighbor.previousNode = node; // With this property we can backtrack and find the shortest path between the start and end node.
  }
}

function getUnvisitedNeighbors(node, grid) 
{
  const neighbors = [];
  const { col, row } = node; //col and row are properties of the node.

  if (row > 0) 
    neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) 
    neighbors.push(grid[row + 1][col]);
  if (col > 0) 
    neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) 
    neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited); // filtering the visited node
}

function getAllNodes(grid) 
{
  const nodes = [];
  for (const row of grid) 
  {
    for (const node of row) 
    {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path from start to target node but works when called *after* the dijkstra method above.

export function getNodesInShortestPathOrder(finishNode) 
{
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) 
  {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
