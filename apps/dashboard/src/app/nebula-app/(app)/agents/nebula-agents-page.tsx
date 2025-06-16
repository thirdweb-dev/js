"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BrainCircuitIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useAgents } from "../hooks/agents/useAgents";

// Dummy data for agents

export function NebulaAgentsPage({ authToken }: { authToken: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { agents } = useAgents({ authToken });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-6">
      {/* Content */}
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Hero Section */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <BrainCircuitIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <h2 className="font-semibold text-3xl">Agents</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore and interact with your agents.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Agents"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-10"
            />
          </div>
        </div>

        {/* Agents Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className="cursor-pointer p-5 transition-shadow hover:shadow-lg"
              >
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium">Agent {agent.name}</h4>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
