import mongoose, { Schema } from "mongoose";

const schema = new Schema(
    {
        title: String,
        difficulty: String,
        topic: String,
        content: Object,
        rounds: String,
        gameId: String,
        createdBy: String,
    },
    {
        timestamps: true,
    }
);

const Game = mongoose.models.Game || mongoose.model("Game", schema);

export default Game;