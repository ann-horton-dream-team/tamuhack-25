import React from 'react'

const DashboardCard = ({ title, code }) => {
  return (
    <div className='w-[300px] h-[120px] bg-gray-900 border-[1px] border-white rounded-md z-10'>
        <div className='flex flex-col items-center justify-center size-full'>
            <div className='font-bold text-lg'>
                {title}
            </div>
            <div>
              Game Code:
            </div>
            <div>
                {code}
            </div>
        </div>
    </div>
  )
}

export default DashboardCard