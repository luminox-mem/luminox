"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AvatarMessage {
  text: string;
  highlight?: string;
}

interface AIAvatarProps {
  message?: AvatarMessage;
  isTyping?: boolean;
  size?: "sm" | "md" | "lg";
  mood?: "neutral" | "happy" | "thinking" | "excited";
  className?: string;
  showMessage?: boolean;
  onMessageComplete?: () => void;
}

export function AIAvatar({
  message,
  isTyping = false,
  size = "md",
  mood = "neutral",
  className,
  showMessage = true,
  onMessageComplete,
}: AIAvatarProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const moodColors = {
    neutral: "from-cyan-400 to-blue-500",
    happy: "from-cyan-400 to-emerald-400",
    thinking: "from-violet-400 to-cyan-400",
    excited: "from-fuchsia-400 to-cyan-400",
  };

  // Typing animation
  useEffect(() => {
    if (!message?.text || !showMessage) {
      setDisplayedText("");
      setIsComplete(false);
      return;
    }

    setDisplayedText("");
    setIsComplete(false);
    let currentIndex = 0;

    if (typingRef.current) {
      clearInterval(typingRef.current);
    }

    typingRef.current = setInterval(() => {
      if (currentIndex < message.text.length) {
        setDisplayedText(message.text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        if (typingRef.current) {
          clearInterval(typingRef.current);
        }
        setIsComplete(true);
        onMessageComplete?.();
      }
    }, 30);

    return () => {
      if (typingRef.current) {
        clearInterval(typingRef.current);
      }
    };
  }, [message?.text, showMessage, onMessageComplete]);

  return (
    <div className={cn("flex items-start gap-4", className)}>
      {/* Avatar Orb */}
      <div className={cn("relative flex-shrink-0", sizeClasses[size])}>
        {/* Outer glow ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-30 blur-xl animate-pulse",
            `bg-gradient-to-br ${moodColors[mood]}`
          )}
        />

        {/* Rotating rings */}
        <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#ringGradient1)"
              strokeWidth="0.5"
              strokeDasharray="10 5"
              className="opacity-60"
            />
            <defs>
              <linearGradient id="ringGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute inset-0 animate-[spin_15s_linear_infinite_reverse]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#ringGradient2)"
              strokeWidth="0.5"
              strokeDasharray="5 10"
              className="opacity-40"
            />
            <defs>
              <linearGradient id="ringGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Main orb */}
        <div
          className={cn(
            "absolute inset-3 rounded-full",
            `bg-gradient-to-br ${moodColors[mood]}`,
            "shadow-[0_0_30px_rgba(34,211,238,0.5),inset_0_0_30px_rgba(255,255,255,0.2)]"
          )}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/30" />

          {/* Face - eyes and expression */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-2 items-center">
              {/* Left eye */}
              <div
                className={cn(
                  "w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]",
                  isTyping && "animate-pulse"
                )}
              />
              {/* Right eye */}
              <div
                className={cn(
                  "w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]",
                  isTyping && "animate-pulse"
                )}
              />
            </div>
          </div>

          {/* Mouth/expression indicator */}
          {mood === "happy" && (
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-3 h-1.5 border-b-2 border-white rounded-full opacity-80" />
          )}
          {mood === "thinking" && (
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-2 h-2 border-2 border-white rounded-full opacity-60 animate-pulse" />
          )}
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-300 rounded-full opacity-60"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Status indicator */}
        <div
          className={cn(
            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
            isTyping ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"
          )}
        />
      </div>

      {/* Message bubble */}
      {showMessage && message && (
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "relative p-4 rounded-2xl rounded-tl-none",
              "bg-gradient-to-br from-slate-900/90 to-slate-800/90 dark:from-slate-800/90 dark:to-slate-900/90",
              "border border-cyan-500/30",
              "shadow-[0_0_20px_rgba(34,211,238,0.1)]",
              "backdrop-blur-sm"
            )}
          >
            {/* Corner accent */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50 rounded-tl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/50 rounded-br" />

            {/* Data stream line */}
            <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{
                  animation: "data-stream 2s linear infinite",
                }}
              />
            </div>

            {/* Message text */}
            <p className="font-tech text-base text-slate-100 leading-relaxed">
              {displayedText}
              {!isComplete && (
                <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />
              )}
            </p>

            {/* Highlight text if provided */}
            {isComplete && message.highlight && (
              <p className="mt-2 font-code text-sm text-cyan-400">
                {message.highlight}
              </p>
            )}
          </div>

          {/* Avatar name */}
          <div className="mt-2 flex items-center gap-2">
            <span className="font-display text-xs text-cyan-500 tracking-wider uppercase">
              Lux
            </span>
            <span className="text-xs text-muted-foreground font-tech">
              AI Assistant
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact avatar for sidebar/header
export function AIAvatarCompact({
  mood = "neutral",
  onClick,
  className,
}: {
  mood?: "neutral" | "happy" | "thinking" | "excited";
  onClick?: () => void;
  className?: string;
}) {
  const moodColors = {
    neutral: "from-cyan-400 to-blue-500",
    happy: "from-cyan-400 to-emerald-400",
    thinking: "from-violet-400 to-cyan-400",
    excited: "from-fuchsia-400 to-cyan-400",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50",
        className
      )}
    >
      {/* Glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-40 blur-md",
          `bg-gradient-to-br ${moodColors[mood]}`
        )}
      />

      {/* Orb */}
      <div
        className={cn(
          "absolute inset-1 rounded-full",
          `bg-gradient-to-br ${moodColors[mood]}`,
          "shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        )}
      >
        {/* Eyes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
          </div>
        </div>
      </div>

      {/* Pulse ring on hover */}
      <div className="absolute inset-0 rounded-full border border-cyan-400/0 hover:border-cyan-400/50 transition-all hover:animate-ping" />
    </button>
  );
}
