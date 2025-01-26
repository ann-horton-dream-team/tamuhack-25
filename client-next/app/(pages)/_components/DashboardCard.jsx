import React from 'react'
import { CiTrash } from "react-icons/ci";
import { toast } from "react-hot-toast"
const DashboardCard = ({ title, code }) => {
  const handleClick = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/games?gameId=${code}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.message}`);
    }
    toast.success('Game deleted');
    return new Response(response, { status: 200 });
    } catch (error) {
      toast.error('Something went wrong');
      throw new Error(`Failed to delete: ${response.message}`);
    }
    
  };

  return (
    <div className='w-[300px] h-[120px] bg-gray-900 border-[1px] border-white rounded-md z-10 relative'>
      <div className='flex flex-col items-center justify-center h-full'>
        <div className='font-bold text-lg'>{title}</div>
        <div>Game Code:</div>
        <div>{code}</div>
      </div>
      <div className='absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm hover:bg-red-700'>
        <CiTrash className='text-white' onClick={handleClick} />
      </div>
    </div>
  );
};

export default DashboardCard