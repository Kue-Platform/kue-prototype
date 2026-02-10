import { useState, useEffect } from "react";

const messages = [
  "Mapping your connections…",
  "Looking for relevant paths…",
  "Finding how you're connected…",
];

const LoadingState = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex gap-1.5 mb-5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      <p
        key={messageIndex}
        className="text-sm text-muted-foreground animate-fade-in"
      >
        {messages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingState;
