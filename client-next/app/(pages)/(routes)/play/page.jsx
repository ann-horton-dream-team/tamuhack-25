"use client";
import React, { useState, useEffect, useRef } from "react"; // Add useRef here
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { MyVideoConference } from "@/components/ui/MyVideoConference";
import { Timer } from "@/components/ui/timer";
import { StartRecordingButton } from "@/components/ui/StartRecordingButton";

const PlayPage = () => {
  const [token, setToken] = useState(null);
  const [join, setJoin] = useState(false);
  const [counter, setCounter] = useState(60);  // Set initial countdown to 120 seconds (2 minutes)
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const serverUrl = "wss://tamuhack-wuv40ylz.livekit.cloud";

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/getToken"); 
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

  useEffect(() => {
    if (token) {
      console.log("Token received:", token);
    }
  }, [token]);

  useEffect(() => {
    let timer;
    if (join && counter > 0) {
      timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    } else if (counter === 0) {
      stopRecording();
      window.location.href = "/play";
    }

    return () => clearInterval(timer);
  }, [join, counter]);

  const startRecording = async () => {
    try {
      setJoin(true); 
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
    <div className="flex items-center justify-center h-screen relative">
      {!join ? (
        <StartRecordingButton startRecording={startRecording} />
      ) : (
        <div>
          <Timer counter={counter} />
          <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={serverUrl}
            style={{
              display: 'absolute',
              bottom: 0,
              right: 0,
              height: '35vh',
              width: '35vw',
            }}
          >
            <div style={{display:'absolute'}}>
            <MyVideoConference />
            <RoomAudioRenderer />
            </div>
          </LiveKitRoom>
        </div>
      )}
    </div>
  );
  
};

export default PlayPage;
