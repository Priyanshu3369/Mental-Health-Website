import { motion } from "framer-motion";

export default function ChatWindow() {
  const messages = [
    { sender: "bot", text: "Hi there! I'm here for you." },
    { sender: "user", text: "I'm feeling a bit overwhelmed..." },
    { sender: "bot", text: "Take a deep breath. I'm listening 💙" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.2 }}
          className={`max-w-md p-3 rounded-xl shadow-sm ${
            msg.sender === "bot"
              ? "bg-white text-left self-start"
              : "bg-calming text-white text-right self-end"
          }`}
        >
          {msg.text}
        </motion.div>
      ))}
    </div>
  );
}
