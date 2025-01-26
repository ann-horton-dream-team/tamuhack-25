import React from 'react'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const StartScreen = ({ title, difficulty, topic, rounds, setStarted, player, players }) => {
  return (
    <>
      <div className='flex items-center justify-center text-center h-screen'>
        {/* This is the screen when the players have entered a room code and are waiting to start the game */}
        <Card className="w-[50%]">
          <CardHeader >
            <CardTitle className="m-3" >{title}</CardTitle>
            <CardDescription>The game is ready. Click "Start Game" to begin.</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              This game will cover {topic} with a difficulty level of {difficulty} and {rounds} rounds.
            </div>
            <div className='mt-4 mb-2 font-bold'>
              Players
            </div>
            <div className='flex items-center justify-center gap-8'>
              {players.map((player, index) => (
                <div key={index}>{player.name}</div>
              ))}
            </div>
            <Button className="w-[50%] bg-gray-800 text-white hover:bg-gray-900 m-5" onClick={setStarted}>Start Game</Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default StartScreen

// import React from 'react'

// const StartScreen = ({ title, difficulty, topic, rounds, setStarted, players }) => {
//   return (
//     <div className='flex items-center justify-center h-screen'>
//       {/* This is the screen when the players have entered a room code and are waiting to start the game */}
//         <ul>
//             <li>{title}</li>
//             <li>{difficulty}</li>
//             <li>{topic}</li>
//             <li>{rounds}</li>
//             <button onClick={setStarted}>start game</button>
//             {players.map((player, index) => (
//               <div key={index}>{player.name}</div>
//             ))}
//         </ul>
//     </div>
//   )
// }

// export default StartScreen