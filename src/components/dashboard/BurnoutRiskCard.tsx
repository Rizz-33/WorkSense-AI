import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type RiskLevel = "low" | "medium" | "high";

const BurnoutRiskCard = () => {
  const { analysis, isAnalyzing } = useAnalysis();

  const riskLevel: RiskLevel = analysis?.burnoutRisk?.level || "low";
  const percentage = analysis?.burnoutRisk?.percentage || 0;
  const explanation = analysis?.burnoutRisk?.explanation;

  const getRiskConfig = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return {
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          strokeColor: "stroke-green-400",
          label: "Low Risk",
          description:
            explanation || "You're maintaining a healthy work-life balance.",
        };
      case "medium":
        return {
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          strokeColor: "stroke-yellow-400",
          label: "Medium Risk",
          description:
            explanation || "Consider taking short breaks between tasks.",
        };
      case "high":
        return {
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          strokeColor: "stroke-red-400",
          label: "High Risk",
          description:
            explanation || "Your workload is elevated. Prioritize self-care.",
        };
    }
  };

  const config = getRiskConfig(riskLevel);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const defaultMessage =
    "Submit a daily reflection to get your personalized burnout risk assessment.";

  return (
    <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              config.color.replace("text-", "bg-")
            )}
          />
          Burnout Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative h-32 w-32">
          {isAnalyzing ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <svg className="h-32 w-32 -rotate-90 transform">
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                  className="stroke-muted/30"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={cn(
                    "transition-all duration-700",
                    config.strokeColor
                  )}
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-2xl font-bold", config.color)}>
                  {percentage}%
                </span>
              </div>
            </>
          )}
        </div>
        <div className="text-center">
          {isAnalyzing ? (
            <p className="text-sm text-muted-foreground">
              Analyzing your reflection...
            </p>
          ) : (
            <>
              {analysis && (
                <span
                  className={cn(
                    "inline-block rounded-full px-3 py-1 text-sm font-medium",
                    config.bgColor,
                    config.color
                  )}
                >
                  {config.label}
                </span>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {analysis ? config.description : defaultMessage}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BurnoutRiskCard;
