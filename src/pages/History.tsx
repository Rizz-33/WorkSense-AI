import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HistoryItem, useAnalysis } from "@/contexts/AnalysisContext";
import { cn } from "@/lib/utils";
import { Clock, FileText, TrendingDown, TrendingUp } from "lucide-react";

type RiskLevel = "low" | "medium" | "high";

const getRiskBadgeStyles = (level: RiskLevel) => {
  switch (level) {
    case "low":
      return "bg-green-400/10 text-green-400 hover:bg-green-400/20";
    case "medium":
      return "bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20";
    case "high":
      return "bg-red-400/10 text-red-400 hover:bg-red-400/20";
  }
};

const History = () => {
  const { history } = useAnalysis();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight">History</h1>
          <p className="mt-1 text-muted-foreground">
            Timeline of your past reflections and insights
          </p>
        </div>

        {history.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No reflections yet</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Start by sharing your daily reflection on the dashboard. Your
                history will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 h-full w-px bg-border md:left-8" />

            <div className="space-y-4">
              {history.map((item: HistoryItem, index: number) => (
                <div
                  key={item.id}
                  className="relative pl-10 md:pl-16 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-5 h-3 w-3 rounded-full border-2 border-background bg-muted-foreground md:left-6" />

                  <Card className="transition-all hover:border-muted-foreground/30">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium text-foreground">
                            {item.dayOfWeek}
                          </span>
                          <span>·</span>
                          <span>{item.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              "font-medium",
                              getRiskBadgeStyles(item.riskLevel)
                            )}
                          >
                            {item.riskLevel.charAt(0).toUpperCase() +
                              item.riskLevel.slice(1)}{" "}
                            Risk
                          </Badge>

                          <div
                            className={cn(
                              "flex items-center gap-1 text-sm font-medium",
                              item.productivityScore >= 70 && "text-green-400",
                              item.productivityScore < 70 &&
                                item.productivityScore >= 40 &&
                                "text-yellow-400",
                              item.productivityScore < 40 && "text-red-400"
                            )}
                          >
                            {item.productivityScore >= 50 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span>{item.productivityScore}%</span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {item.summary}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
