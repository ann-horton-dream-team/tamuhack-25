"use client"

import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ShortUniqueId from 'short-unique-id';

const CreatePage = () => {
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [topic, setTopic] = useState("");
    const [rounds, setRounds] = useState("");

    // Display on screen after game is generated
    const [gameCode, setGameCode] = useState("");

    const { isLoaded, isSignedIn, user } = useUser();

    const handleEvent1 = (event) => {
        setTitle(event.target.value);
    };
    const handleEvent2 = (event) => {
        setDifficulty(event.target.value);
    };
    const handleEvent3 = (event) => {
        setTopic(event.target.value);
    };
    const handleEvent4 = (event) => {
        setRounds(event.target.value);
    };

    const generateGame = async () => {
        // Comment in once game is made
        // if (!title || !topic || !rounds) return;

        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/games`;

        const userId = user?.id;
        const { randomUUID } = new ShortUniqueId({ dictionary: 'number', length: 7 });
        const gameId = randomUUID();

        toast.success('Loading...');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    difficulty: difficulty,
                    topic: topic,
                    rounds: rounds,
                    gameId: gameId,
                    createdBy: userId,
                }),
            });

            if (!response.ok) {
                toast.error('Something went wrong.');
                throw new Error(`Response status: ${response.status}`);
            } else {
                toast.success('Game created!');
                setGameCode(gameId);
            }
        } catch (error) {
            toast.error('Something went wrong.');
            throw new Error(`Failed to create game: ${error}`);
        }

        return new Response('Game Created', { status: 201 });
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            {/* Need to fill out the title, difficulty, topic (like hashmap or array or wtv leetcode topics there are) and # of rounds */}
            {/* Then show game code on screen so player can copy it and share */}
            <form className='p-10'>
                <input
                    className='mx-10 border-2'
                    type='text'
                    placeholder='Game Title...'
                    value={title}
                    onChange={handleEvent1}></input>
                <input
                    className='mx-10 border-2'
                    type='number'
                    placeholder='Rounds...'
                    value={rounds}
                    onChange={handleEvent4}></input>
                <select className='mx-10' onChange={handleEvent2} value={difficulty}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <select className='mx-10' onChange={handleEvent3} value={topic}>
                    <option value="lists">Lists</option>
                    <option value="hashmaps">HashMaps</option>
                    <option value="recursion">Recursion</option>
                    <option value="graphs">Graphs</option>
                </select>

            </form>

            <button onClick={generateGame}>Generate</button>
        </div>
    )
}

export default CreatePage