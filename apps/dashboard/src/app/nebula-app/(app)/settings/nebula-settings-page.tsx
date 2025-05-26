"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export function NebulaSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [customPrompt, setCustomPrompt] = useState("");
  const [autoExecution, setAutoExecution] = useState(false);

  const handleSaveCustomPrompt = () => {
    // TODO: Implement save to backend when API is available
    toast.success("Custom prompt saved successfully");
  };

  const handleAutoExecutionToggle = (checked: boolean) => {
    setAutoExecution(checked);
    // TODO: Implement save to backend when API is available
    toast.success(`Auto execution ${checked ? "enabled" : "disabled"}`);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="container max-w-4xl px-4 py-8">
        <h1 className="mb-8 font-semibold text-2xl">Settings</h1>

        <Card className="p-6">
          <div className="space-y-8">
            {/* Custom Prompt Section */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Custom Prompt</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Customize Nebula's responses to match your expertise level and
                  communication preferences. This prompt will be included with
                  every message to provide consistent context.
                </p>
              </div>

              <Textarea
                placeholder="Example: I'm a developer with foundational blockchain experience seeking to enhance my smart contract development skills. I need guidance on advanced patterns, security best practices, and optimization techniques with practical code examples."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[120px]"
              />

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Tip: Include your experience level, preferred response style,
                  and specific areas of interest
                </p>
                <Button
                  onClick={handleSaveCustomPrompt}
                  size="sm"
                  variant="default"
                >
                  Save Prompt
                </Button>
              </div>
            </div>

            <Separator />

            {/* Auto Execution Section */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Auto Execution</h3>
                <p className="text-sm text-muted-foreground">
                  Allow Nebula to automatically execute transactions on your
                  behalf when using a smart account
                </p>
              </div>
              <Switch
                checked={autoExecution}
                onCheckedChange={handleAutoExecutionToggle}
              />
            </div>

            <Separator />

            {/* Theme Section */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred visual theme
                </p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
