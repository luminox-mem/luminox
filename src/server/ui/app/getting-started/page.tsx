"use client";

import { useState, useEffect } from "react";
import { AIAvatar, AIAvatarCompact } from "@/components/ai-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronLeft,
  Terminal,
  Settings,
  Zap,
  Rocket,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  avatarMessage: {
    text: string;
    highlight?: string;
  };
  avatarMood: "neutral" | "happy" | "thinking" | "excited";
  code?: string;
  codeLanguage?: string;
  tips?: string[];
  action?: {
    label: string;
    href: string;
  };
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "Install Luminox",
    description: "Add the Luminox SDK to your project",
    avatarMessage: {
      text: "Welcome to Luminox! I'm Lux, your AI guide. Let's set up your context data platform. First, install the package using npm or yarn.",
      highlight: "This will add the SDK to your project's dependencies.",
    },
    avatarMood: "excited",
    code: `# Using npm
npm install luminox-sdk

# Using yarn
yarn add luminox

# Using pnpm
pnpm add luminox`,
    codeLanguage: "bash",
    tips: [
      "Luminox works with Node.js 18+ and modern browsers",
      "TypeScript types are included out of the box",
    ],
  },
  {
    id: 2,
    title: "Initialize Configuration",
    description: "Set up your Luminox client instance",
    avatarMessage: {
      text: "Now let's initialize the Luminox client. You'll need to configure the server URL and optional settings for your AI agent's memory system.",
      highlight: "The client handles all communication with the Luminox server.",
    },
    avatarMood: "thinking",
    code: `import { Luminox } from 'luminox-sdk';

// Initialize the client
const luminox = new Luminox({
  serverUrl: 'http://localhost:8000',
  // Optional: customize settings
  timeout: 30000,
  retries: 3,
});

// Verify connection
await luminox.health();
console.log('Connected to Luminox!');`,
    codeLanguage: "typescript",
    tips: [
      "Set serverUrl to your Luminox server address",
      "Use environment variables for production configs",
    ],
  },
  {
    id: 3,
    title: "Create a Session",
    description: "Start tracking your AI agent's conversations",
    avatarMessage: {
      text: "Sessions are the core of Luminox. Each session represents a conversation or task flow. Messages, context, and learned skills are all tied to sessions.",
      highlight: "Sessions persist your agent's memory across interactions.",
    },
    avatarMood: "happy",
    code: `// Create a new session
const session = await luminox.sessions.create({
  name: 'Customer Support Chat',
  metadata: {
    userId: 'user_123',
    channel: 'web',
  },
});

console.log('Session ID:', session.id);

// Add messages to the session
await luminox.messages.create(session.id, {
  role: 'user',
  content: 'How do I reset my password?',
});

await luminox.messages.create(session.id, {
  role: 'assistant',
  content: 'I can help you reset your password...',
});`,
    codeLanguage: "typescript",
    tips: [
      "Sessions can be connected to Spaces for skill learning",
      "Use metadata to tag sessions for analytics",
    ],
  },
  {
    id: 4,
    title: "Connect to Spaces",
    description: "Enable skill learning and knowledge storage",
    avatarMessage: {
      text: "Spaces are where your agent learns! When you connect a session to a space, Luminox can extract SOPs and skills from successful interactions.",
      highlight: "Spaces enable your agents to learn and improve over time.",
    },
    avatarMood: "excited",
    code: `// Create a space for your domain
const space = await luminox.spaces.create({
  name: 'Customer Support Skills',
  description: 'Learned procedures from support chats',
});

// Connect your session to the space
await luminox.sessions.connect(session.id, space.id);

// Extract skills from completed tasks
const task = await luminox.tasks.create(session.id, {
  name: 'Password Reset Flow',
  status: 'success',
});

// The system will analyze and learn from this!`,
    codeLanguage: "typescript",
    tips: [
      "Spaces can be shared across multiple sessions",
      "Successful tasks automatically contribute to learning",
    ],
  },
  {
    id: 5,
    title: "Monitor & Observe",
    description: "Track your agent's performance in the dashboard",
    avatarMessage: {
      text: "You're all set! Now head to the dashboard to monitor your sessions, track task success rates, and observe your agent's learning progress.",
      highlight: "The dashboard gives you full visibility into your AI operations.",
    },
    avatarMood: "happy",
    code: `// Fetch session analytics
const stats = await luminox.analytics.sessions({
  timeRange: '7d',
});

console.log('Total sessions:', stats.total);
console.log('Success rate:', stats.successRate);

// Get learned skills from a space
const skills = await luminox.spaces.getSkills(space.id);
skills.forEach(skill => {
  console.log(skill.name, skill.confidence);
});`,
    codeLanguage: "typescript",
    action: {
      label: "Open Dashboard",
      href: "/dashboard",
    },
    tips: [
      "Use Jaeger integration for distributed tracing",
      "Check the dashboard regularly to optimize your agents",
    ],
  },
];

function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-cyan-500/20 rounded-t-lg">
        <span className="font-code text-xs text-cyan-400 uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-tech text-slate-400 hover:text-cyan-400 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="relative p-4 bg-slate-950/90 rounded-b-lg overflow-x-auto border border-t-0 border-cyan-500/20">
        <pre className="font-code text-sm text-slate-300 leading-relaxed">
          <code>{code}</code>
        </pre>

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 211, 238, 0.03) 2px, rgba(34, 211, 238, 0.03) 4px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: WorkflowStep[];
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <button
          key={step.id}
          onClick={() => onStepClick(index)}
          className={cn(
            "relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300",
            "font-display text-sm font-semibold",
            index === currentStep
              ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.4)]"
              : index < currentStep
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-slate-800/50 text-slate-500 border border-slate-700/50 hover:border-cyan-500/30"
          )}
        >
          {index < currentStep ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            step.id
          )}

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "absolute left-full w-2 h-0.5 top-1/2 -translate-y-1/2",
                index < currentStep
                  ? "bg-emerald-500/50"
                  : "bg-slate-700/50"
              )}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export default function GettingStartedPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const step = workflowSteps[currentStep];

  const handleStepChange = (newStep: number) => {
    if (newStep === currentStep || isAnimating) return;

    setIsAnimating(true);
    setShowContent(false);

    setTimeout(() => {
      setCurrentStep(newStep);
      setShowContent(true);
      setIsAnimating(false);
    }, 300);
  };

  const handleNext = () => {
    if (currentStep < workflowSteps.length - 1) {
      handleStepChange(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  const stepIcons = [Terminal, Settings, Zap, Sparkles, Rocket];
  const StepIcon = stepIcons[currentStep] || Terminal;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
              <Rocket className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-wide text-glow-cyan">
                Getting Started
              </h1>
              <p className="font-tech text-muted-foreground">
                Set up Luminox in your project
              </p>
            </div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-between">
          <StepIndicator
            steps={workflowSteps}
            currentStep={currentStep}
            onStepClick={handleStepChange}
          />

          <div className="font-tech text-sm text-muted-foreground">
            Step {currentStep + 1} of {workflowSteps.length}
          </div>
        </div>

        {/* Main content */}
        <div
          className={cn(
            "transition-all duration-300",
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          {/* Avatar section */}
          <div className="mb-8">
            <AIAvatar
              message={step.avatarMessage}
              mood={step.avatarMood}
              size="lg"
              showMessage={showContent}
            />
          </div>

          {/* Step content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Info */}
            <div className="space-y-6">
              {/* Step title card */}
              <div className="tech-card rounded-2xl p-6 corner-decor">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/30">
                    <StepIcon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold tracking-wide">
                      {step.title}
                    </h2>
                    <p className="font-tech text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Tips */}
                {step.tips && step.tips.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg bg-slate-900/30 dark:bg-slate-800/30 border border-cyan-500/10">
                    <h3 className="font-display text-xs uppercase tracking-wider text-cyan-400 mb-3">
                      Pro Tips
                    </h3>
                    <ul className="space-y-2">
                      {step.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 font-tech text-sm text-muted-foreground"
                        >
                          <Sparkles className="w-4 h-4 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action button */}
                {step.action && (
                  <Link href={step.action.href}>
                    <Button className="mt-4 w-full cyber-btn h-12 font-display tracking-wider">
                      {step.action.label}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Code */}
            <div>
              {step.code && (
                <CodeBlock code={step.code} language={step.codeLanguage} />
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="font-tech h-11 px-6 border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-500/50 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {workflowSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentStep
                    ? "bg-cyan-400 w-6"
                    : index < currentStep
                    ? "bg-emerald-400/50"
                    : "bg-slate-600"
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentStep === workflowSteps.length - 1}
            className="font-tech h-11 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-30"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Quick nav hint */}
        <div className="mt-4 text-center">
          <p className="font-code text-xs text-muted-foreground">
            Use <kbd className="px-1.5 py-0.5 mx-1 rounded bg-slate-800 border border-slate-700">←</kbd>
            <kbd className="px-1.5 py-0.5 mx-1 rounded bg-slate-800 border border-slate-700">→</kbd>
            arrow keys to navigate
          </p>
        </div>
      </div>
    </div>
  );
}
