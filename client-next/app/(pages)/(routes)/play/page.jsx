"use client";
import React, { useState, useEffect } from "react";
import { VideoConference, LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";

const PlayPage = () => {
  const [token, setToken] = useState(null);
  const [join, setJoin] = useState(false); // To control if the user has clicked the button
  const serverUrl = "wss://tamuhack-wuv40ylz.livekit.cloud"; // Replace with your LiveKit server URL

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/getToken"); // Use GET method
        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json(); // Parse response as JSON
        setToken(data.token); // Store the JWT token
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);  // Removed token dependency to prevent infinite loop

  useEffect(() => {
    if (token) {
      console.log("Token received:", token);
    }
  }, [token]);

  const handleJoin = () => {
    setJoin(true); // Set join to true when the user clicks the button
  };

  if (!token) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {!join ? (
        <div className="text-center">
          <button
            onClick={handleJoin}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
          >
            Join Video Call
          </button>
        </div>
      ) : (
        <LiveKitRoom token={token} serverUrl={serverUrl} connect={true} video={true} audio={true} style={{ height: '60vh', width: '80%' }}>
          <VideoConference />
        </LiveKitRoom>
      )}
    </div>
  );
};

export default PlayPage;
