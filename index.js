const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Server is running!</h1>");
});

app.get("*", (req, res) => {
  res.send("404!!!");
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    socket.in(room).emit("member_count", io.sockets.adapter.rooms.get(room).size);

    console.log(`User with ID: ${socket.id} joined room: ${room}`);
    console.log("Join member: ", io.sockets.adapter.rooms.get(room).size);

    let socketsOfRoom = io.sockets.adapter.rooms;
    console.log(socketsOfRoom?.length);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    // socket.to(room).emit("member_count", memberCount--);

    console.log("User Disconnected", socket.id);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});
