"use client";

import { useRecordVoice } from "@/lib/hook/useRecordVoice";
import { Microphone } from "./Microphone";
import { ChatHistory } from "./ChatHistory";

export const AppContainer = () => {
  const { startRecording, stopRecording, messages } = useRecordVoice();

  return (
    <>
      <div className="sticky top-0 h-[139px] w-screen">
        <div className="text-white flex justify-start items-center ml-[35px] text-[36px] w-full h-full">
          Voice AI
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full h-full">
        <Microphone
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      </div>
      <ChatHistory messages={messages} />
    </>
  );
};
