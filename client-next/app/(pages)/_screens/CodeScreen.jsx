import React, { useState, useEffect, useRef } from "react";
import { VideoConference, LiveKitRoom, GridLayout, ParticipantTile, TrackRefContext, RoomAudioRenderer, ControlBar, useTracks } from "@livekit/components-react";
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { FaMicrophone } from "react-icons/fa";

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
        height: '30vh',
        width: '30vw',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}>
        <ParticipantTile style={{ flex: 1 }} />
        <ControlBar variation='minimal' />
      </div>
    </GridLayout>
  );
}

const CodeScreen = ({ question, setAnswer }) => {
  const [token, setToken] = useState(null);
  const [join, setJoin] = useState(false);
  const [counter, setCounter] = useState(120);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [microphone, setMicrophone] = useState(false);

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
    let timer;
    if (counter > 0) {
      startRecording();
      timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    } else if (counter === 0) {
      stopRecording();
      window.location.href = "/results";
    }
    return () => clearInterval(timer);
  }, [counter]);

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

  if (!token) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-black bg-gradient-to-b from-black to-[#5D2CA8] relative overflow-clip text-white h-screen text-sm pt-16">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="rounded-3xl p-1 bg-gradient-to-b from-purple-600 to-purple-400 h-[500px]">
          <div className='flex items-center justify-center h-full rounded-[calc(1.5rem-1px)] p-10 bg-slate-900'>
            <div className='flex flex-col items-start justify-center gap-4 text-white' style={{ whiteSpace: 'pre-line' }}>
              <div className='font-bold text-xl'>{question.title}</div>
              <div>{question.question}</div>
              <div>Example 1: {question.example_1}</div>
              <div>Example 2: {question.example_2}</div>
            </div>
          </div>
        </div>
        <div className='grid grid-rows-2 gap-4'>
          {!microphone ? (
            <Textarea className='bg-slate-900 text-white w-full h-[400px] p-6 text-start' placeholder='Type here...'></Textarea>
          ) : (
            <div className='bg-slate-900 rounded-md border border-white text-white w-full h-[400px] p-6 text-start'></div>
          )}
          <div className='flex items-start justify-start bg-slate-900 w-full max-h-[200px] rounded-lg'>
            <div className='flex items-center justify-center text-center h-full w-full text-white border border-white rounded-lg gap-16'>
              <button onClick={() => { setMicrophone(true); setRecording(!recording); }}>
                {!recording ? <FaMicrophone className='text-6xl' /> : <FaMicrophone className='text-6xl text-red-600' />}
              </button>
              <Button className="px-12 py-4 bg-white text-black hover:bg-gray-100 m-5">Submit</Button>
            </div>
          </div>
        </div>
      </div>
      <LiveKitRoom video={true} audio={true} token={token} serverUrl={serverUrl}>
        <MyVideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
      <div className="timer" style={{ color: 'black', fontSize: '2rem', fontWeight: 'bold', position: 'absolute', top: 85, right: 25 }}>
        <p>Time remaining: {String(Math.floor(counter / 60)).padStart(2, '0')}:{String(counter % 60).padStart(2, '0')}</p>
      </div>
    </div>
  );
};

export default CodeScreen;
