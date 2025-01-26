"use client";
import React, { useState, useEffect } from "react";
import { VideoConference, LiveKitRoom, GridLayout, ParticipantTile, TrackRefContext, RoomAudioRenderer, ControlBar, useTracks } from "@livekit/components-react";
import { Track } from 'livekit-client';
import '@livekit/components-styles';
const PlayPage = () => {
  const [token, setToken] = useState(null);
  const [join, setJoin] = useState(false); // To control if the user has clicked the button
  const [counter, setCounter] = useState(0);
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
        <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: '100vh' }}
      >
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </LiveKitRoom>
      )}
    </div>
  );
};

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
export default PlayPage;
