const express = require('express');
const { createServer } = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);

app.use(cors());

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});