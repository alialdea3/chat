const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app); // Crear el servidor HTTP utilizando Express
const io = socketio(server); // Configurar Socket.IO para trabajar con el servidor HTTP

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Manejar todas las solicitudes GET para cualquier ruta
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  let username;

  socket.on("join", (name) => {
    username = name;
    io.emit("chat message", `${username} se ha unido al chat`);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", `${username}: ${msg}`);
  });

  socket.on("image message", (imageData) => {
    io.emit("image message", { username, imageData });
  });

  socket.on("disconnect", () => {
    io.emit("chat message", `${username} ha abandonado el chat`);
  });
});

server.listen(port, host, () => {
  console.log(`Socket.IO server running at http://${host}:${port}/`);
});
