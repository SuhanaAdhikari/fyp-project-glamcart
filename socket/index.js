const socketIO = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

require("dotenv").config();

const io = socketIO(server, {
  cors: {
    origin: [
      
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io", // ← Add this
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Socket.IO server is running");
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

io.on("connection", (socket) => {
  console.log(`✅ A user connected: ${socket.id}`);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  const messages = {};

  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });
    const user = getUser(receiverId);

    if (!messages[receiverId]) {
      messages[receiverId] = [message];
    } else {
      messages[receiverId].push(message);
    }

    io.to(user?.socketId).emit("getMessage", message);
  });

  socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
    const user = getUser(senderId);
    if (messages[senderId]) {
      const message = messages[senderId].find(
        (m) => m.receiverId === receiverId && m.id === messageId
      );
      if (message) {
        message.seen = true;
        io.to(user?.socketId).emit("messageSeen", { senderId, receiverId, messageId });
      }
    }
  });

  socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
    io.emit("getLastMessage", { lastMessage, lastMessagesId });
  });

  socket.on("disconnect", () => {
    console.log(`❌ A user disconnected: ${socket.id}`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server is running on port ${PORT}`);
});

