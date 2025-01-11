import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingBubbleProps {
  word: string;
  delay: number;
  initialX: number;
  initialY: number;
}

export const FloatingBubble = ({ word, delay, initialX, initialY }: FloatingBubbleProps) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x, // Slight horizontal movement
        y: prev.y - 1.5, // Constant upward movement
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const bubbleColors = [
    "bg-bubble-purple",
    "bg-bubble-pink",
    "bg-bubble-blue",
    "bg-bubble-peach",
  ];

  return (
    <div
      className={cn(
        "absolute transition-all duration-[1000ms] ease-in-out opacity-0",
        mounted && "opacity-100",
        bubbleColors[Math.floor(Math.random() * bubbleColors.length)]
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%)`,
        animationDelay: `${delay}s`,
      }}
    >
      <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm bg-opacity-50">
        <span className="text-gray-800 font-medium text-sm md:text-base">
          {word}
        </span>
      </div>
    </div>
  );
};

const words = ["Hope", "Confidence", "Support", "Empathy", "Courage", "Health", "Love", "Strength", "Kindness", "Resilience"];

export const Index = () => {
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#4169E1] to-[#1E3A8A]">
        <div className="absolute inset-0 z-0">
          {mounted && words.map((word, index) => (
            <FloatingBubble 
              key={word} 
              word={word}
              delay={index * 10}
              initialX={Math.random() * 100}
              initialY={120 + Math.random() * 50} // Start below the viewport
            />
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
            Harmoni
          </h1>
          <p className="absolute bottom-8 max-w-2xl text-center text-gray-300 px-4 italic">
            Offrir un espace sûr et anonyme où chaque étudiant peut partager ses préoccupations sans jugement et être écouté avec bienveillance.
          </p>
        </div>
      </div>
    );
  };