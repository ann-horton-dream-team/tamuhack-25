"use client";
import React, { useState, useEffect, useRef } from "react";
import { VideoConference, LiveKitRoom, GridLayout, ParticipantTile, TrackRefContext, RoomAudioRenderer, ControlBar, useTracks } from "@livekit/components-react";
import { LocalParticipant, Track } from 'livekit-client';
import '@livekit/components-styles';



const PlayPage = () => {
  const [token, setToken] = useState(null);
  const [join, setJoin] = useState(false); // To control if the user has clicked the button
  const [counter, setCounter] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);

  
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


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        setAudioBlob(event.data);
      });
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

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
        onDisconnected={console.log(1)}
      >
        <MyVideoConference />
        <RoomAudioRenderer />
        
      </LiveKitRoom>
      )}
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {/* Display recorded audio if available */}
      {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
    </div>
    </div>
  );
};

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera},
    ],
    { onlySubscribed: false },
  );
  return (
<GridLayout
  tracks={tracks}
  style={{
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: '35vh',  // 1/8th of the screen height
    width: '35vw',   // 1/8th of the screen width
  }}
>
  <div style={{
    display: 'flex',
    flexDirection: 'column',  // Stack ParticipantTile and Control Panel vertically
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',  // Take full space of the GridLayout container
    width: '100%',   // Full width of the container
  }}>
    <ParticipantTile style={{ flex: 1 }} />
    <ControlBar variation='minimal'/>
  </div>
</GridLayout>

  );
}
export default PlayPage;
