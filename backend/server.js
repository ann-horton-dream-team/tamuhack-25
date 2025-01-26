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

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});