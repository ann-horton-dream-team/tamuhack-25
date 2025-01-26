import React from 'react'

const WaitingScreen = () => {
  return (
    <div className="bg-black bg-gradient-to-b from-black to-[#5D2CA8] relative overflow-clip text-white h-screen">
      <div className='flex items-center justify-center h-screen text-white'>
        Waiting for responses...
      </div>
    </div>
  )
}

export default WaitingScreen