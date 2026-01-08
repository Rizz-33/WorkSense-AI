import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalysis } from "@/contexts/AnalysisContext";
import {
  AlertTriangle,
  Calendar,
  Lightbulb,
  Loader2,
  TrendingUp,
} from "lucide-react";

const iconMap = {
  TrendingUp,
  Calendar,
  AlertTriangle,
  Lightbulb,
};

const defaultInsights = [
  {
    icon: "Lightbulb" as const,
    text: "Submit a daily reflection to receive AI-powered insights",
    type: "suggestion" as const,
  },
];

const AIInsightsCard = () => {
  const { analysis, isAnalyzing } = useAnalysis();

  const insights =
    analysis?.insights && analysis.insights.length > 0
      ? analysis.insights
      : defaultInsights;

  const getIconColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-yellow-400 bg-yellow-400/10";
      case "suggestion":
        return "text-chart-1 bg-chart-1/10";
      case "insight":
        return "text-green-400 bg-green-400/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <Card
      className="col-span-2 lg:col-span-1 animate-fade-in"
      style={{ animationDelay: "300ms" }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <span className="h-2 w-2 rounded-full bg-chart-2" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Generating insights...
            </span>
          </div>
        ) : (
          <ul className="space-y-3">
            {insights.map((insight, index) => {
              const IconComponent = iconMap[insight.icon] || Lightbulb;
              return (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-background/50 p-3 transition-colors hover:bg-background"
                >
                  <div
                    className={`rounded-lg p-2 ${getIconColor(insight.type)}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="text-sm leading-relaxed">
                    {insight.text}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;
