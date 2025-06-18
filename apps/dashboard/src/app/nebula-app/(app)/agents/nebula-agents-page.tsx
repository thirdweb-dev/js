"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { BrainCircuitIcon } from "lucide-react";
import Link from "next/link";
import { useAgents } from "../hooks/agents/useAgents";

// Dummy data for agents

function EmptyAgentsStateComponent() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-6">
      {/* Content */}
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex w-full flex-col items-center justify-center gap-2 text-foreground">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <BrainCircuitIcon className="h-8 w-8 text-white" />
          </div>
          <div className="font-semibold text-xl">No agents available!</div>
          <div className="text-muted-foreground text-sm">
            It seems like you don't have any agents yet.
          </div>

          <Button asChild size="sm" className="mt-4">
            <Link href={"/agents/create"} className="text-sm">
              Create
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function NebulaAgentsPage({ authToken }: { authToken: string }) {
  const { agents } = useAgents({ authToken });
  const router = useDashboardRouter();

  if (!agents || agents.length === 0) {
    return <EmptyAgentsStateComponent />;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-6">
      <div className="flex w-full items-end justify-end">
        <Button asChild size="sm" className="mt-4">
          <Link href={"/agents/create"} className="text-sm">
            Create
          </Link>
        </Button>
      </div>
      {/* Content */}
      <div className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center space-y-8">
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

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className="cursor-pointer p-5 transition-shadow hover:shadow-lg"
                onClick={() => router.push(`/agents/${agent.id}`)}
              >
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium">{agent.name}</h4>
                    <p className="text-muted-foreground text-sm">
                      Created at:{" "}
                      {new Date(agent.created_at).toLocaleDateString()}
                    </p>
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
