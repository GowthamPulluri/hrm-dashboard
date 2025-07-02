"use client";
import React from "react";
import { motion } from "motion/react";

export function ColourfulText({
  text
}) {
const colors = [
  "#4ADE80", // Fresh Green (Success, Growth, Eco-friendly)
  "#60A5FA", // Soft Blue (Innovation, Clarity, Calm)
  "#FBBF24", // Golden Yellow (Energy, Optimism, Bright Ideas)
  "#38BDF8", // Sky Blue (Trust, Tech, Positivity)
  "#A78BFA", // Light Purple (Creativity, Vision, Modern)
  "#FDE68A", // Pale Yellow (Warmth, Cheerful, Friendly)
];

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return text.split("").map((char, index) => (
    <motion.span
      key={`${char}-${count}-${index}`}
      initial={{
        y: 0,
      }}
      animate={{
        color: currentColors[index % currentColors.length],
        y: [0, -3, 0],
        scale: [1, 1.01, 1],
        filter: ["blur(0px)", `blur(5px)`, "blur(0px)"],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
      className="inline-block whitespace-pre font-sans tracking-tight">
      {char}
    </motion.span>
  ));
}
