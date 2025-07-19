import React, { useState, useEffect, useRef } from "react";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi, I'm here for you. How are you feeling today?",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();
      const botMsg = {
        sender: "bot",
        text: data.reply,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);

      // 🎧 Play voice reply
      const audio = new Audio(`http://localhost:5000${data.audio}`);
      audio.play().catch((e) => console.error("Audio playback failed:", e));
    } catch (error) {
      console.error("Error fetching bot response", error);
      setLoading(false);
    }
  };

  // 🎤 Handle Speech Recognition
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice input not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInput(speechText);
      handleSend(speechText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="p-4 text-2xl font-semibold text-center text-purple-700">
        🧠 Your Mental Health Companion
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-xl max-w-xs ${
                msg.sender === "user"
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-800 shadow"
              }`}
            >
              <div>{msg.text}</div>
              <div className="text-[10px] text-gray-400 text-right mt-1">{msg.time}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="my-2 flex justify-start">
            <div className="text-sm text-gray-600">🤖 Bot is typing...</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 flex gap-2 items-center border-t bg-white">
        <button
          onClick={handleVoiceInput}
          className={`rounded-full p-2 text-white ${
            listening ? "bg-red-500" : "bg-purple-500"
          } hover:bg-purple-600 transition`}
          title={listening ? "Listening..." : "Start Voice Input"}
        >
          🎤
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="Type or speak your thoughts..."
          className="flex-1 p-2 border rounded-xl focus:outline-none"
        />

        <button
          onClick={() => handleSend(input)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
