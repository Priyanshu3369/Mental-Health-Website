import React, { useState } from "react";

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😟", label: "Anxious" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😐", label: "Neutral" },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submitMood = async (mood) => {
    try {
      await fetch("http://localhost:5000/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, timestamp: new Date().toISOString() }),
      });

      setSelectedMood(mood);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    } catch (err) {
      console.error("Failed to submit mood:", err);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-purple-700">How are you feeling today?</h2>
      <div className="flex space-x-4 text-3xl">
        {moods.map((m) => (
          <button
            key={m.label}
            onClick={() => submitMood(m.label)}
            className={`hover:scale-110 transition transform ${
              selectedMood === m.label ? "scale-110 ring-2 ring-purple-500" : ""
            }`}
            title={m.label}
          >
            {m.emoji}
          </button>
        ))}
      </div>
      {submitted && <p className="text-green-500 mt-4">Mood saved!</p>}
    </div>
  );
};

export default MoodTracker;
