/**
 * Status Message Cycler for Long-Running PDF Processing
 * 
 * Cycles through realistic status messages during PDF processing (2-3 minutes)
 * and simulates progress from 0% to 90-96%
 */

export interface StatusCyclerConfig {
  messages?: string[];
  minInterval?: number; // milliseconds
  maxInterval?: number; // milliseconds
  randomize?: boolean;
  targetProgress?: number; // 90-96%
  duration?: number; // milliseconds (120000-150000 for 2-2.5 minutes)
}

export interface StatusCycler {
  start: () => void;
  stop: () => void;
  getCurrentMessage: () => string;
  getCurrentProgress: () => number;
}

// 19 realistic, progressive status messages
const DEFAULT_MESSAGES = [
  "Initializing PDF processing...",
  "Extracting text from PDF...",
  "Reading document pages...",
  "Text extraction complete...",
  "Parsing document structure...",
  "Identifying data tables...",
  "Detecting column headers...",
  "Analyzing content layout...",
  "AI is processing your data...",
  "Organizing student records...",
  "Validating data integrity...",
  "AI is categorizing results...",
  "Processing department information...",
  "Calculating statistics...",
  "Structuring data for display...",
  "AI is finalizing analysis...",
  "Generating visual insights...",
  "Preparing results dashboard...",
  "Almost ready..."
];

/**
 * Creates a status message cycler with simulated progress
 * 
 * @param onMessageChange - Callback fired when message changes
 * @param onProgressChange - Callback fired when progress updates
 * @param config - Configuration options
 * @returns Control object with start/stop methods
 */
export function createStatusMessageCycler(
  onMessageChange: (message: string) => void,
  onProgressChange: (progress: number) => void,
  config: StatusCyclerConfig = {}
): StatusCycler {
  const {
    messages = DEFAULT_MESSAGES,
    minInterval = 6000, // 6 seconds
    maxInterval = 10000, // 10 seconds
    randomize = true,
    targetProgress = 90 + Math.random() * 6, // 90-96%
    duration = 120000 + Math.random() * 30000 // 2-2.5 minutes
  } = config;

  let messageIntervalId: NodeJS.Timeout | null = null;
  let progressIntervalId: NodeJS.Timeout | null = null;
  let currentMessageIndex = 0;
  let currentProgress = 0;
  let isRunning = false;

  const getRandomInterval = (): number => {
    if (!randomize) return minInterval;
    return Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval;
  };

  const cycleMessage = () => {
    if (currentMessageIndex < messages.length) {
      onMessageChange(messages[currentMessageIndex]);
      currentMessageIndex++;
    } else {
      // Loop back to last few messages if still processing
      currentMessageIndex = Math.max(0, messages.length - 3);
      onMessageChange(messages[currentMessageIndex]);
      currentMessageIndex++;
    }

    if (isRunning) {
      messageIntervalId = setTimeout(cycleMessage, getRandomInterval());
    }
  };

  const updateProgress = () => {
    const steps = 100;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const progressTick = () => {
      if (!isRunning) return;

      currentStep++;
      if (currentStep >= steps) {
        currentProgress = targetProgress;
        onProgressChange(Math.round(currentProgress));
        return;
      }

      // Easing function for natural progression (ease-out cubic)
      const progress = currentStep / steps;
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      currentProgress = easedProgress * targetProgress;
      onProgressChange(Math.round(currentProgress));

      progressIntervalId = setTimeout(progressTick, intervalTime);
    };

    progressTick();
  };

  const start = () => {
    if (isRunning) return;

    isRunning = true;
    currentMessageIndex = 0;
    currentProgress = 0;

    // Start with first message immediately
    onMessageChange(messages[0]);
    onProgressChange(0);
    currentMessageIndex = 1;

    // Schedule next message
    messageIntervalId = setTimeout(cycleMessage, getRandomInterval());

    // Start progress simulation
    updateProgress();
  };

  const stop = () => {
    isRunning = false;

    if (messageIntervalId) {
      clearTimeout(messageIntervalId);
      messageIntervalId = null;
    }

    if (progressIntervalId) {
      clearTimeout(progressIntervalId);
      progressIntervalId = null;
    }

    currentMessageIndex = 0;
    currentProgress = 0;
  };

  const getCurrentMessage = (): string => {
    return currentMessageIndex > 0 
      ? messages[Math.min(currentMessageIndex - 1, messages.length - 1)]
      : messages[0];
  };

  const getCurrentProgress = (): number => {
    return Math.round(currentProgress);
  };

  return {
    start,
    stop,
    getCurrentMessage,
    getCurrentProgress
  };
}

/**
 * React Hook wrapper for status message cycler
 * 
 * @example
 * ```tsx
 * const [message, setMessage] = useState("");
 * const [progress, setProgress] = useState(0);
 * const cycler = useStatusMessageCycler(setMessage, setProgress);
 * 
 * useEffect(() => {
 *   if (isLoading) cycler.start();
 *   else cycler.stop();
 * }, [isLoading]);
 * ```
 */
export function useStatusMessageCycler(
  onMessageChange: (message: string) => void,
  onProgressChange: (progress: number) => void,
  config?: StatusCyclerConfig
): StatusCycler {
  const cyclerRef = React.useRef<StatusCycler | null>(null);

  if (!cyclerRef.current) {
    cyclerRef.current = createStatusMessageCycler(
      onMessageChange,
      onProgressChange,
      config
    );
  }

  React.useEffect(() => {
    return () => {
      cyclerRef.current?.stop();
    };
  }, []);

  return cyclerRef.current;
}
