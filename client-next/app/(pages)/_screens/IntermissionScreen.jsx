import React from 'react'

const IntermissionScreen = ({ players, handleNewQuestion }) => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='flex flex-col gap-4'>
        {players.map((player, index) => (
          <div key={index}>
            {player.name}: {player.totalScore}
          </div>
        ))}
        <button onClick={handleNewQuestion}>Continue</button>
      </div>
    </div>
  )
}

export default IntermissionScreen