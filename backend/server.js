const { AccessToken } = require('livekit-server-sdk');
const express = require('express');
const { createServer } = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const server = createServer(app);
require('dotenv').config();

app.use(cors());

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on('connection', socket => {
    socket.on('message', (message, room) => {
        console.log(message);
        if(room === '') {
        socket.broadcast.emit('broadcast', message)
        }
        else {
            socket.to(room).emit('broadcast', message);
        }
    })
    socket.on('join-room', room => {
        socket.join(room);
    })
})

const createToken = async () => {
    const roomName = 'interview';
    const participantName = 'quickstart-username';
    

    const at = new AccessToken(`APIaESJERDfgY2i`, `VOfv78FEoHlb8Ty7YyhsQd70MC7NzUxvMSEfcL4dbSk`, {
      identity: participantName//
    });
    at.addGrant({ roomJoin: true, room: roomName });
    return await at.toJwt();
  };

  app.get('/getToken', async (req, res) => {
    try {
        console.log("Generating token...");
        console.log(process.env.REACT_APP_LIVEKIT_API_KEY);
        const token = await createToken();
        res.json({ token });  // Send token as JSON response
    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});