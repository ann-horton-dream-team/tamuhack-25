import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Game from "@/models/game";
import { gameQuestions } from "@/models/game-questions";

export async function POST(request) {
    const { title, difficulty, topic, rounds, gameId, createdBy } = await request.json();

    const GAME_PROMPT = `Generate a set of ${rounds} coding interview questions covering ${topic} with a difficulty level of ${difficulty}. Provide examples of expected output. The question should be thorough and detailed and resemble the style of leetcode questions. The question titles should describe the problem that is being generated. Output the response in JSON format. The text will be placed in an HTML div, so do not format output at all. No asterisks or code blocks. Follow the given structure:\n{\nquestions: [\n{\ntitle: String,\nquestion: String,\nexample_1: String,\nexample_2: String,\n}\n]\n}`;

    const gameResponse = await gameQuestions.sendMessage(GAME_PROMPT);
    const questions = JSON.parse(gameResponse.response.text());

    console.log(questions);

    await connectDB();
    await Game.create({ title, difficulty, topic, rounds, content: questions, gameId, createdBy });
    return NextResponse.json({ message: "Game Created" }, { status: 201 });
}

export async function GET(request) {
    const url = request.nextUrl;
    const createdBy = url.searchParams.get("createdBy");
    const gameId = url.searchParams.get("gameId");

    const query = {};
    if (createdBy) query.createdBy = createdBy;
    if (gameId) query.gameId = gameId;

    await connectDB();

    const games = await Game.find(query);
    return NextResponse.json({ games });
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("gameId");
    await connectDB();
    await Game.findByIdAndDelete(id);
    return NextResponse.json({ message: "Game Deleted" }, { status: 200 });
}