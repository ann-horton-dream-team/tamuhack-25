'use client';

import React from 'react'
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';


const UserTurnScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState('');
  const [socket, setSocket] = useState(null);

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleInputChangetwo = (event) => {
    setRoom(event.target.value);
  };

  const updateRoom = (e) => {
    e.preventDefault();
    setMessages([{text: `Joined: ${room}`, sender:'system'}])
    socket.emit('join-room', room);
  }
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      socket.emit('message', newMessage, room);
      setNewMessage('');
    }
  };
  
  useEffect(() => {
    // Create the socket connection once
    const socketConnection = io('http://localhost:8000');
    setSocket(socketConnection);

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: socket.id, sender: 'system' },
        ]);
      });

      socket.on('broadcast', message => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, sender: 'system' },
        ]);
      })

      // Other socket listeners can be added here
    }
  }, [socket]);



  return (
    <div className='flex items-center justify-center h-screen'>
        <div className='border-4 w-80 h-80 bg-red'>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <form className='flex flex-col' id='form'>
          <label>Message</label>
          <input 
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message..." 
          /> 
          <button id='message-button' onClick={sendMessage}>Send</button>
          <label>Room</label>
          <input 
            type="text"
            value={room}
            onChange={handleInputChangetwo}
            placeholder="(Optional) Enter a room" 
          />
          <button onClick={updateRoom}>Join</button>
        </form>
    </div>
  )
}

export default UserTurnScreen