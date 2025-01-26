import React from "react";
import { GridLayout, ParticipantTile, ControlBar, useTracks } from "@livekit/components-react";
import { Track } from 'livekit-client';

export const MyVideoConference = () => {
  const tracks = useTracks([{ source: Track.Source.Camera }], { onlySubscribed: false });

  return (
    <div>

    
    </div>
  );
};
