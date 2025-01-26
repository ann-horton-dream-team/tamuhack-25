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

let games = [];

io.on('connection', socket => {
    console.log(`User joined: ${socket.id}`);

    socket.on('playerJoin', (room, questions) => {
        console.log(`User joined room: ${socket.id}`);
        socket.join(room);

        let game = games.find(game => game.roomId === room);

        if (!game) {
            games.push(
                {
                    roomId: room,
                    players: [],
                    questions: questions,
                    questionIndex: 0,
                    playerAnswers: 0,
                }
            );
            game = games.find(game => game.roomId === room);
        }

        const player = {
            name: `Player ${game?.players.length + 1}`,
            totalScore: 0,
            totalTimeScore: 0,
            totalSpaceScore: 0,
            totalDsaScore: 0,
            totalClarityScore: 0,
        };
        game.players.push(player);

        socket.room = room;
        socket.name = player.name;

        socket.emit('setNewPlayer', player);
        io.to(room).emit('broadcastPlayerJoin', game.players);
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);

        let game = games.find(game => game.roomId === socket.room);

        if (game) {
            game.players = game.players.filter(player => player.name != socket.name);
            if (game.players.length === 0) {
                games = games.filter(game => game.roomId !== socket.room);
            } else {
                io.to(socket.room).emit('broadcastPlayerLeave', game.players);
            }
        }
    });

    socket.on('gameStart', (room) => {
        let game = games.find(game => game.roomId === room);
        io.to(room).emit('broadcastGameStart', game.questions[0]);
    });

    socket.on('playerAnswer', (room) => {
        let game = games.find(game => game.roomId === room);
        game.playerAnswers += 1;
        if (game.players.length == game.playerAnswers) {
            // End question
            io.to(room).emit('broadcastQuestionEnd');
            game.playerAnswers = 0;
            game.questionIndex += 1;
        }
    });

    socket.on('setScores', (room, user, final, time, space, dsa, explanation) => {
        let game = games.find(game => game.roomId === room);
        let player = game.players.find(p => p.name === user.name);

        player.totalScore += parseInt(final, 10);
        player.totalTimeScore += parseInt(time, 10);
        player.totalSpaceScore += parseInt(space, 10);
        player.totalDsaScore += parseInt(dsa, 10);
        player.totalClarityScore += parseInt(explanation, 10);
    });

    socket.on('setIntermission', (room) => {
        let game = games.find(game => game.roomId === room);
        io.to(room).emit('broadcastIntermission', game.players);
    });

    socket.on('setNewQuestion', (room) => {
        let game = games.find(game => game.roomId === room);
        if (game.questionIndex === game.questions.length) {
            io.to(room).emit('broadcastGameEnd');
        } else {
            io.to(room).emit('broadcastNewQuestion', game.questions[game.questionIndex]);
        }
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
