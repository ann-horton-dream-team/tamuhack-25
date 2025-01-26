import React from 'react'

const EndScreen = ({ players }) => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='flex flex-col gap-4'>
        {players.map((player, index) => (
          <div key={index}>
            {player.name}: {player.totalScore}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EndScreen