import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface BurnoutRisk {
  level: "low" | "medium" | "high";
  percentage: number;
  explanation: string;
}

export interface Insight {
  text: string;
  type: "info" | "warning" | "suggestion" | "insight";
  icon: "TrendingUp" | "Calendar" | "AlertTriangle" | "Lightbulb";
}

export interface AnalysisResult {
  burnoutRisk: BurnoutRisk;
  insights: Insight[];
  productivityScore: number;
  summary: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  dayOfWeek: string;
  reflection: string;
  summary: string;
  riskLevel: "low" | "medium" | "high";
  productivityScore: number;
  timestamp: number;
}

interface AnalysisContextType {
  analysis: AnalysisResult | null;
  setAnalysis: (analysis: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  history: HistoryItem[];
  addToHistory: (reflection: string, analysis: AnalysisResult) => void;
  productivityTrend: { day: string; productivity: number; date: string }[];
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
);

const HISTORY_STORAGE_KEY = "worksense_history";

const getDayOfWeek = (date: Date): string => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (reflection: string, analysisResult: AnalysisResult) => {
    const now = new Date();
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: formatDate(now),
      dayOfWeek: getDayOfWeek(now),
      reflection,
      summary: analysisResult.summary,
      riskLevel: analysisResult.burnoutRisk.level,
      productivityScore: analysisResult.productivityScore,
      timestamp: now.getTime(),
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const productivityTrend = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const last7Days: { day: string; productivity: number; date: string }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = days[date.getDay()];
      const dateStr = formatDate(date);

      // Find entries for this day
      const dayEntries = history.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return itemDate.toDateString() === date.toDateString();
      });

      const avgProductivity =
        dayEntries.length > 0
          ? Math.round(
              dayEntries.reduce(
                (sum, item) => sum + item.productivityScore,
                0
              ) / dayEntries.length
            )
          : 0;

      last7Days.push({
        day: dayName,
        productivity: avgProductivity,
        date: dateStr,
      });
    }

    return last7Days;
  })();

  return (
    <AnalysisContext.Provider
      value={{
        analysis,
        setAnalysis,
        isAnalyzing,
        setIsAnalyzing,
        history,
        addToHistory,
        productivityTrend,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
};
