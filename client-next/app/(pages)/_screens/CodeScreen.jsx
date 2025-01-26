import React, { useState, useEffect, useRef } from "react";
import { VideoConference, LiveKitRoom, GridLayout, ParticipantTile, TrackRefContext, RoomAudioRenderer, ControlBar, useTracks } from "@livekit/components-react";
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import '@livekit/components-styles';


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
        left: 0,
        height: '30vh',  // 1/8th of the screen height
        width: '30vw',   // 1/8th of the screen width
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

const CodeScreen = ({ question, setAnswer }) => {
  const [token, setToken] = useState(null);
  const [join, setJoin] = useState(false); // Controls if the user has clicked the button
  const [counter, setCounter] = useState(120);  // Countdown timer for 2 minutes
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);

  const serverUrl = "wss://tamuhack-wuv40ylz.livekit.cloud"; // LiveKit server URL

  // Fetch token logic
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/getToken"); // Replace with your token endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  // Timer countdown logic
  useEffect(() => {
    let timer;
    if (counter > 0) {
      startRecording();
      timer = setInterval(() => {
        setCounter((prev) => prev - 1);  // Decrease counter by 1 every second
      }, 1000);
    } else if (counter === 0) {
      stopRecording();
      window.location.href = "/results"; // Redirect to the results page when time is up
    }

    return () => clearInterval(timer);  // Cleanup timer on unmount or timer stop
  }, [counter]);

  // Start recording
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

  // Stop recording
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

          <div className="flex flex-col items-center justify-center gap-4" style={{ whiteSpace: 'pre-line' }}>
            <div>{question.title}</div>
            <div>{question.question}</div>
            <div>{question.example_1}</div>
            <div>{question.example_2}</div>
            {/* Submit the answer */}
            <button 
              onClick={() => setAnswer('use a two pointer approach, this algorithm has a time complexity of n^4 and a space complexity of n^2')}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
            >
              Submit
            </button>
          </div>
          <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={serverUrl}
          style={{ 
            position: 'fixed',   // Keeps video fixed while scrolling
            bottom: '20px',      // Adjust distance from the bottom
            left: '-40px',       // Adjust distance from the right
            height: '35vh',      // Height as 35% of the viewport height
            width: '35vw',       // Width as 35% of the viewport width
            zIndex: 9999,        // Ensures video stays on top
          }}
        >
          <MyVideoConference />
          <RoomAudioRenderer />
          </LiveKitRoom>
          {/* Timer display */}
          <div className="timer" style={{ color: 'black', fontSize: '2rem', fontWeight: 'bold', position: 'absolute', top: 85, right: 25 }}>
            <p>
              Time remaining: {String(Math.floor(counter / 60)).padStart(2, '0')}:
              {String(counter % 60).padStart(2, '0')}
            </p>
          </div>
        
      
    </div>
  );
};

export default CodeScreen;
