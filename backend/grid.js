// Create an empty 10x10 grid with cell objects
const initializeGrid = () => {
  return Array(10)
    .fill()
    .map(
      () =>
        Array(10)
          .fill()
          .map(() => ({ selected: false, value: "" })) // Initialize each cell with 'selected' and 'value'
    );
};

// Update the grid at a specific position
const updateGrid = (grid, row, col, char) => {
  if (!grid[row][col].selected) {
    // If the cell is not already selected
    grid[row][col] = { selected: true, value: char }; // Set the character and mark it as selected
  }
  return grid;
};

module.exports = { initializeGrid, updateGrid };
