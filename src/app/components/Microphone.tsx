"use client";

import { IconMic } from "../icons/IconMic";

interface MicrophoneProps {
  startRecording: () => void;
  stopRecording: () => void;
}

const Microphone = ({ startRecording, stopRecording }: MicrophoneProps) => {
  return (
    <div className="w-[250px] h-[250px] bg-[#FFFFFF80] rounded-3xl flex flex-col justify-center items-center text-white hover:bg-[#ff000080]">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className="border-none bg-transparent w-10"
      >
        <IconMic />
      </button>
    </div>
  );
};

export { Microphone };
