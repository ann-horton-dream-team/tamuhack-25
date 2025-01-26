import React from 'react'
import { Button } from "@/components/ui/button";

const StartScreen = ({ title, difficulty, topic, rounds, setStarted, player, players }) => {
  return (
    <>
      <div className="bg-black bg-gradient-to-b from-black to-[#5D2CA8] relative overflow-clip text-white">
        <div className='flex items-center justify-center text-center h-screen'>
          <div className="w-[760px] rounded-3xl p-1 bg-gradient-to-b from-purple-600 to-purple-400 ">
            <div className="rounded-[calc(1.5rem-1px)] px-10 py-16 bg-slate-900">
              <h3 className="text-3xl font-bold pb-8">{title}</h3>
              <p>Click "Start Game" to begin.</p>
              <p>This game will cover {topic} with a difficulty level of {difficulty} and {rounds} rounds. </p>

              <div>
                <div className='mt-6 mb-2 font-bold items-center'>
                  Players
                </div>
                <div className='flex items-center justify-center gap-8'>
                  {players.map((player, index) => (
                    <div key={index}>{player.name}</div>
                  ))}
                </div>
                <Button className="w-[60%] bg-white text-black hover:bg-gray-100 m-5 mt-10" onClick={setStarted}>Start Game</Button>
              </div>
            </div>
          </div>
          <div className="absolute h-[375px] w-[130%] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000000_82%,#9560EB)] top-[calc(100%-125px)]" />
        </div>

        {/* This is the screen when the players have entered a room code and are waiting to start the game */}
        {/* <Card className="h-[50%] w-[50%] border-2 border-gray-300 bg-white">
          <CardHeader>
            <CardTitle className="m-3">{title}</CardTitle>
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
        </Card> */}
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