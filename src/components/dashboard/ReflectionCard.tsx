import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mic, Send } from "lucide-react";
import { useState } from "react";

const ReflectionCard = () => {
  const [reflection, setReflection] = useState("");
  const { setAnalysis, isAnalyzing, setIsAnalyzing, addToHistory } =
    useAnalysis();

  const handleSubmit = async () => {
    if (!reflection.trim()) {
      toast({
        title: "Empty reflection",
        description: "Please share how your work day went.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    const reflectionText = reflection.trim();

    try {
      const { data, error } = await supabase.functions.invoke(
        "analyze-reflection",
        {
          body: { reflection: reflectionText },
        }
      );

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data);
      addToHistory(reflectionText, data);
      toast({
        title: "Reflection analyzed",
        description: data.summary || "Your daily insights have been updated.",
      });
      setReflection("");
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to analyze reflection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceInput = () => {
    toast({
      title: "Voice input",
      description: "Voice recording feature coming soon.",
    });
  };

  return (
    <Card className="col-span-2 lg:col-span-1 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <span className="h-2 w-2 rounded-full bg-chart-1" />
          Daily Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="How was your work today? What challenges did you face? How are you feeling about your workload?"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="min-h-[120px] resize-none bg-background/50 focus:bg-background transition-colors"
          disabled={isAnalyzing}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleVoiceInput}
            className="shrink-0"
            disabled={isAnalyzing}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="flex-1"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Analyze Reflection
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflectionCard;
