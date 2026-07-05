import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ type = 'default' }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Interview preparation steps
  const interviewSteps = [
    { text: "Preparing your interview environment..." },
    { text: "Setting up AI interviewer..." },
    { text: "Loading question database..."},
    { text: "Calibrating assessment tools...", },
    { text: "Almost ready! Get comfortable..." }
  ];

  // Results evaluation messages
  const resultMessages = [
    { text: "Analyzing your responses..." },
    { text: "Evaluating technical skills..."},
    { text: "Assessing communication style..."},
    { text: "Calculating final score..."},
    { text: "Generating detailed feedback..."}
  ];

  useEffect(() => {
    if (type === 'interviewPage' || type === 'resultsPage') {
      const steps = type === 'interviewPage' ? interviewSteps : resultMessages;
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1500);

      return () => clearInterval(interval);
    }

    if (type === 'asyncLoad') {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            return prev + Math.random() * 15;
          }
          return 100;
        });
      }, 200);

      return () => clearInterval(progressInterval);
    }
  }, [type]);


 if (type === 'default') {
    return (
      <div className="flex items-start justify-start">
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            className="w-6 h-6 border-2 border-purple-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner spinning arc */}
          <motion.div
            className="absolute inset-0 w-6 h-6 border-t-2 border-purple-500 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          {/* Center pulsing dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }


  if (type === 'asyncLoad') {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-purple-500 rounded-full"
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <motion.p
            className="text-gray-700 dark:text-gray-400 text-sm"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading data...
          </motion.p>
        </div>
      </div>
    );
  }

  if (type === 'interviewPage') {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-white darkbg-[#10131c]">
        <div className="max-w-md mx-auto text-center">
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {interviewSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                  animate={{
                    scale: index === currentStep ? [1, 1.3, 1] : 1,
                    opacity: index <= currentStep ? 1 : 0.3
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>



          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h3 className="text-xl font-semibold text-black dark:text-white">
                {interviewSteps[currentStep]?.text}
              </h3>
              <p className="text-gray-400 text-sm">
                Step {currentStep + 1} of {interviewSteps.length}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-center">
            <motion.div
              className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'resultsPage') {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-white darkbg-[#10131c]">
        <div className="max-w-md mx-auto text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgb(75 85 99)"
                strokeWidth="4"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: (currentStep + 1) / resultMessages.length }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                  strokeDasharray: "251.2",
                  strokeDashoffset: 0
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-2xl font-bold text-white"
                key={currentStep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {Math.round(((currentStep + 1) / resultMessages.length) * 100)}%
              </motion.span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >

              <h3 className="text-lg font-medium text-white">
                {resultMessages[currentStep]?.text}
              </h3>
              <p className="text-gray-400 text-sm">
                This may take a few moments...
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}