"use client";
import { useEffect, useState, useRef } from "react";
import { createMediaStream } from "../createMediaStream";
import { blobToBase64 } from "../utils";

export const useRecordVoice = () => {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const [response, setResponse] = useState<string | undefined>("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const isRecording = useRef(false);
  const chunks = useRef<Blob[]>([]);

  const startRecording = () => {
    if (mediaRecorder) {
      isRecording.current = true;
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      isRecording.current = false;
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const getText = async (base64data: any) => {
    try {
      const response = await fetch("/api/speechToText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio: base64data,
        }),
      }).then((res) => res.json());
      const { text } = response;
      setText(text);
      return text;
    } catch (error) {
      console.log(error);
    }
  };

  const getAiReply = async (text: string) => {
    console.log("text in getAiReply:", text);
    console.log("messages in getAiReply:", messages);

    messages.push({ role: "user", content: text });

    try {
      const apiResponse = await fetch("/api/aiReply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newMessages: messages,
        }),
      }).then((res) => res.json());

      const { apiText } = apiResponse;
      messages.push({ role: "assistant", content: apiText });
      setMessages([...messages]);

      setResponse(apiText);
      const voiceResponse = await fetch("/api/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: apiText,
        }),
      }).then((res) => res.json());

      const audio = new Audio(voiceResponse.audioUrl);
      audio.play();
    } catch (error) {
      console.log(error);
    }
  };

  const initialMediaRecorder = (stream: any) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstart = () => {
      setText("");
      createMediaStream(stream, isRecording.current, () => {});
      chunks.current = [];
    };

    mediaRecorder.ondataavailable = (ev) => {
      chunks.current.push(ev.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      if (audioBlob.size === 0) return;
      blobToBase64(audioBlob, async (data: any) => {
        console.log("before getText");
        const text = await getText(data);
        console.log("after gettext, text:", text);
        getAiReply(text);
      });
    };

    setMediaRecorder(mediaRecorder);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder);
    }
  }, []);

  return {
    recording,
    startRecording,
    stopRecording,
    text,
    response,
    audio,
    messages,
  };
};
