import React from "react";

export const Timer = ({ counter }) => {
  return (
    <div
      className="timer"
      style={{
        color: 'black',
        fontSize: '2rem',
        fontWeight: 'bold',
        position: 'fixed',
        top: '60px', // Adjust this to position the timer below the navbar
        right: 0,
        zIndex: 10, // Ensure it's on top of other content
      }}
    >
      <p>
        Time remaining: {String(Math.floor(counter / 60)).padStart(2, '0')}:
        {String(counter % 60).padStart(2, '0')}
      </p>
    </div>
  );
};
