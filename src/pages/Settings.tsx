import Header from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Mic, Moon, Type } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [voiceInput, setVoiceInput] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [inputPreference, setInputPreference] = useState("text");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-2xl py-8">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Customize your WorkSense AI experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Input Preferences */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Type className="h-5 w-5 text-muted-foreground" />
                Input Preference
              </CardTitle>
              <CardDescription>
                Choose your preferred method for daily reflections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={inputPreference}
                onValueChange={setInputPreference}
                className="grid gap-3"
              >
                <div className="flex items-center space-x-3 rounded-lg border bg-background/50 p-4 transition-colors hover:bg-background">
                  <RadioGroupItem value="text" id="text" />
                  <Label
                    htmlFor="text"
                    className="flex flex-1 cursor-pointer items-center gap-3"
                  >
                    <Type className="h-5 w-5 text-chart-1" />
                    <div>
                      <p className="font-medium">Text Input</p>
                      <p className="text-sm text-muted-foreground">
                        Type your daily reflections
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border bg-background/50 p-4 transition-colors hover:bg-background">
                  <RadioGroupItem value="voice" id="voice" />
                  <Label
                    htmlFor="voice"
                    className="flex flex-1 cursor-pointer items-center gap-3"
                  >
                    <Mic className="h-5 w-5 text-chart-2" />
                    <div>
                      <p className="font-medium">Voice Input</p>
                      <p className="text-sm text-muted-foreground">
                        Speak your daily reflections
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border bg-background/50 p-4 transition-colors hover:bg-background">
                  <RadioGroupItem value="both" id="both" />
                  <Label
                    htmlFor="both"
                    className="flex flex-1 cursor-pointer items-center gap-3"
                  >
                    <div className="flex -space-x-1">
                      <Type className="h-4 w-4 text-chart-1" />
                      <Mic className="h-4 w-4 text-chart-2" />
                    </div>
                    <div>
                      <p className="font-medium">Both</p>
                      <p className="text-sm text-muted-foreground">
                        Switch between text and voice
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-muted-foreground" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border bg-background/50 p-4">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-chart-3" />
                  <div>
                    <Label className="font-medium">Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly burnout risk report
                    </p>
                  </div>
                </div>
                <Switch
                  checked={weeklySummary}
                  onCheckedChange={setWeeklySummary}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-background/50 p-4">
                <div className="flex items-center gap-3">
                  <BellOff className="h-5 w-5 text-chart-4" />
                  <div>
                    <Label className="font-medium">Daily Reminder</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded to log your daily reflection
                    </p>
                  </div>
                </div>
                <Switch
                  checked={dailyReminder}
                  onCheckedChange={setDailyReminder}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance - simplified for dark theme app */}
          <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Moon className="h-5 w-5 text-muted-foreground" />
                Appearance
              </CardTitle>
              <CardDescription>
                WorkSense AI is designed for dark mode to reduce eye strain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-lg border bg-background/50 p-4 opacity-60">
                <Moon className="h-5 w-5 text-chart-1" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Optimized for late-night productivity analysis
                  </p>
                </div>
                <div className="ml-auto rounded-full bg-chart-1/20 px-2 py-1 text-xs font-medium text-chart-1">
                  Active
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
