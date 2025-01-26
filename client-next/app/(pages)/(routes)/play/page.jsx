"use client";
import React, { useState, useEffect, useRef } from "react";
import { VideoConference, LiveKitRoom, GridLayout, ParticipantTile, TrackRefContext, RoomAudioRenderer, ControlBar, useTracks } from "@livekit/components-react";
import { Track } from 'livekit-client';
import '@livekit/components-styles';

const PlayPage = () => {
  const [token, setToken] = useState(null);
  const [join, setJoin] = useState(false); // To control if the user has clicked the button
  const [counter, setCounter] = useState(120);  // Set initial countdown to 120 seconds (2 minutes)
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);

  const serverUrl = "wss://tamuhack-wuv40ylz.livekit.cloud"; // Replace with your LiveKit server URL

  // Fetch token logic
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

  // Timer countdown logic
  useEffect(() => {
    let timer;
    if (join && counter > 0) {
      timer = setInterval(() => {
        setCounter((prev) => prev - 1);  // Decrease counter by 1 every second
      }, 1000);
    } else if (counter === 0) {
      // Redirect to results page when timer reaches 0
      stopRecording();
      window.location.href = "/play"; // Use window.location to redirect to /results
    }

    return () => clearInterval(timer);  // Cleanup the timer on component unmount or if timer stops
  }, [join, counter]);

  const startRecording = async () => {
    try {
      setJoin(true);  // Set join to true when user clicks "Join Video Call"
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

  if (!token) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {!join ? (
        <div className="text-center">
          <button
            onClick={startRecording}
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
          style={{ 
            position: 'absolute',
            bottom: 0,
            right: 0,
            height: '100vh',  // 1/8th of the screen height
            width: '35vw',   // 1/8th of the screen width
          }}
        >
          <MyVideoConference />
          <RoomAudioRenderer />
          <div className="timer" style={{ color: 'black', fontSize: '2rem', fontWeight: 'bold', position:'absolute', top:100, right:25}}>
          <p>
            Time remaining: {String(Math.floor(counter / 60)).padStart(2, '0')}:
            {String(counter % 60).padStart(2, '0')}
          </p>
          </div>
        </LiveKitRoom>
      )}
    </div>
  );
};

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera },
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
        <ControlBar variation='minimal' />
      </div>
    </GridLayout>
  );
}

export default PlayPage;
