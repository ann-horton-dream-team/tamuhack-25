import React from "react";

export const StartRecordingButton = ({ startRecording }) => {
  return (
    <div className="text-center">
      <button
        onClick={startRecording}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
      >
        Join Video Call
      </button>
    </div>
  );
};
