// App.tsx
import React, { useState } from "react";

declare global {
  interface Window { FreeAIForAll: any; }
}

export default function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const ai = new window.FreeAIForAll({ temperature: 0.7 });

    setMessages(prev => [...prev, `You: ${input}`]);
    try {
      const reply = await ai.chat(input);
      setMessages(prev => [...prev, `AI: ${reply}`]);
    } catch (err) {
      setMessages(prev => [...prev, `AI failed: ${err.message}`]);
    }

    setInput("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Free-AI-For-All TSX Test</h1>
      <div style={{ minHeight: 200, border: "1px solid gray", padding: 10 }}>
        {messages.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
