import React, { useEffect, useState } from "react";

const moodColors = {
  Happy: "bg-yellow-200 text-yellow-800",
  Sad: "bg-blue-200 text-blue-800",
  Anxious: "bg-purple-200 text-purple-800",
  Angry: "bg-red-200 text-red-800",
  Neutral: "bg-gray-200 text-gray-800",
};

const MoodHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/mood/history")
      .then((res) => res.json())
      .then((data) => setHistory(data.reverse()))  // reverse for recent first
      .catch((err) => console.error("Failed to fetch mood history", err));
  }, []);

  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-purple-700 mb-4">Mood History</h2>
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {history.map((entry, idx) => (
          <li
            key={idx}
            className={`rounded-lg px-4 py-2 flex justify-between items-center shadow-sm ${moodColors[entry.mood] || "bg-gray-100"}`}
          >
            <span className="font-medium">{entry.mood}</span>
            <span className="text-sm">
              {new Date(entry.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodHistory;
