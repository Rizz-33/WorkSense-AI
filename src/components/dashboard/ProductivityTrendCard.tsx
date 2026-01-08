import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalysis } from "@/contexts/AnalysisContext";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ProductivityTrendCard = () => {
  const { productivityTrend, history } = useAnalysis();

  const weeklyAverage =
    productivityTrend.filter((d) => d.productivity > 0).length > 0
      ? Math.round(
          productivityTrend
            .filter((d) => d.productivity > 0)
            .reduce((sum, d) => sum + d.productivity, 0) /
            productivityTrend.filter((d) => d.productivity > 0).length
        )
      : 0;

  const hasData = history.length > 0;

  return (
    <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <span className="h-2 w-2 rounded-full bg-chart-1" />
          Productivity Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[180px] items-center justify-center text-muted-foreground">
            <p className="text-sm">
              Submit your first reflection to see trends
            </p>
          </div>
        ) : (
          <>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={productivityTrend}
                  margin={{ top: 5, right: 20, bottom: 5, left: -20 }}
                >
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="productivity"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: "hsl(var(--chart-1))" }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Weekly average:{" "}
                <span className="font-medium text-foreground">
                  {weeklyAverage}%
                </span>
              </span>
              <span className="text-muted-foreground">
                {history.length} reflection{history.length !== 1 ? "s" : ""}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductivityTrendCard;
