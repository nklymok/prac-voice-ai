import { twMerge } from "tailwind-merge";

interface ChatHistoryProps {
  messages: any[];
}

export const ChatHistory = ({ messages }: ChatHistoryProps) => {
  return (
    <div className="text-white sticky bottom-0 w-[850px] p-[20px] text-3xl flex flex-col items-center h-[340px] bg-[#ffffff80] rounded-t-3xl overflow-auto">
      <p>Chat history:</p>
      <div className="flex flex-col justify-center items-start">
        {messages.map((message, index) => (
          <p
            className={twMerge(
              "text-xl",
              index % 2 === 0 ? "text-blue-300" : "text-yellow-300"
            )}
            key={index}
          >
            {message.role}: {message.content}
          </p>
        ))}
      </div>
    </div>
  );
};
