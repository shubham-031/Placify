'use client';
import React from "react";

const dummyQuestions = [
  {
    title: "Tell me about yourself.",
    description: "Give a brief introduction highlighting your background, interests, and skills.",
    difficulty: "Easy",
  },
  {
    title: "Why do you want to work at our company?",
    description: "Explain your motivation for joining and how you align with our goals.",
    difficulty: "Medium",
  },
  {
    title: "What are your strengths and weaknesses?",
    description: "Mention 2–3 of each with examples and how you're improving.",
    difficulty: "Medium",
  },
  {
    title: "Describe a challenge you faced and how you overcame it.",
    description: "Talk about a real-world situation, your actions, and the outcome.",
    difficulty: "Hard",
  },
  {
    title: "Where do you see yourself in 5 years?",
    description: "Share your career goals and growth expectations.",
    difficulty: "Medium",
  },
  {
    title: "What motivates you?",
    description: "Discuss internal or external factors that drive your performance.",
    difficulty: "Easy",
  },
  {
    title: "How do you handle stress and pressure?",
    description: "Provide real examples and coping strategies.",
    difficulty: "Medium",
  },
  {
    title: "What is your biggest professional achievement?",
    description: "Describe a major success and what led to it.",
    difficulty: "Hard",
  },
  {
    title: "How do you prioritize your work?",
    description: "Explain task management strategies or tools you use.",
    difficulty: "Easy",
  },
  {
    title: "Why should we hire you?",
    description: "Summarize your unique value, skills, and cultural fit.",
    difficulty: "Medium",
  },
];

const QuestionBank = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">📚 Question Bank</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {dummyQuestions.map((q, i) => (
          <div key={i} className="p-4 border rounded-lg shadow bg-gray-50 dark:bg-gray-800 dark:text-white">
            <h3 className="text-lg font-semibold mb-1">{q.title}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{q.description}</p>
            <span
              className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded ${
                q.difficulty === "Easy"
                  ? "bg-green-100 text-green-800"
                  : q.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {q.difficulty}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Start Interview
        </button>
      </div>
    </div>
  );
};

export default QuestionBank;
