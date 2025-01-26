const { AccessToken } = require('livekit-server-sdk');
const express = require('express');
const { createServer } = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const server = createServer(app);
const { Room } = require('livekit-server-sdk');  // Import Room class
require('dotenv').config();

app.use(cors());

// Set up socket.io
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",  // Adjust as necessary for your front-end origin
        methods: ["GET", "POST"],
    }
});

// When a new socket connection is established
io.on('connection', socket => {
    console.log('New client connected:', socket.id);

    socket.on('message', (message, room) => {
        console.log('Message:', message, 'Room:', room);
        if (room === '') {
            socket.broadcast.emit('broadcast', message);
        } else {
            socket.to(room).emit('broadcast', message);  // Send message to specific room
        }
    });

    socket.on('join-room', room => {
        console.log('Joining room:', room);
        socket.join(room);  // Join the specified room
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Function to create a unique room name based on a random string or a timestamp
const generateRoomName = () => {
    return `room-${Date.now()}`;  // Unique room name based on current timestamp
};

// Function to create the access token for the LiveKit room
const createToken = async () => {
    const roomName = generateRoomName();  // Generate unique room name for each token
    const participantName = 'player';  // You can set this dynamically for each user

    // Use your LiveKit API key and secret from environment variables
    const apiKey = 'APIaESJERDfgY2i';
    const apiSecret = 'VOfv78FEoHlb8Ty7YyhsQd70MC7NzUxvMSEfcL4dbSk';

    // Generate access token
    const at = new AccessToken(apiKey, apiSecret, {
        identity: participantName,
    });

    // Grant permissions for joining the room
    at.addGrant({
        roomJoin: true,
        room: roomName,  // Use the dynamically generated room name
    });

    return at.toJwt();  // Return JWT token
};

// Endpoint to get the access token
app.get('/getToken', async (req, res) => {
    try {
        console.log("Generating token...");
        const token = await createToken();
        res.json({ token, room: generateRoomName() });  // Send token and the room name
    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
