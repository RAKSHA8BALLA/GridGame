//working
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const { initializeGrid, updateGrid } = require("./grid");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let activeUsers = 0;
let grid = initializeGrid(); // Initializes a 10x10 grid
let lastPlayerId = null; // Track the last player who made a move

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "../frontend/build")));

// WebSocket connection
io.on("connection", (socket) => {
  activeUsers++;
  io.emit("users", activeUsers); // Broadcast number of active users

  // Send the current grid state to the new connection
  socket.emit("grid", grid);

  // Handle grid update
  socket.on("updateGrid", ({ row, col, char }) => {
    if (lastPlayerId === socket.id) {
      socket.emit(
        "error",
        "You cannot update until another player makes a move."
      );
      return; // Prevent this player from making a move
    }
    grid = updateGrid(grid, row, col, char);
    lastPlayerId = socket.id; // Update the last player ID
    io.emit("grid", grid); // Broadcast updated grid to all players
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    activeUsers--;
    io.emit("users", activeUsers); // Broadcast updated user count
  });
});

// Serve the React app on any other route not handled by Socket.IO
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});

