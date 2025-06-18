"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useAgent } from "../../hooks/agents/useAgent";

export default function AgentPage({
  authToken,
  agentId,
}: { authToken: string; agentId: string }) {
  const { agent, isLoading, error } = useAgent({ authToken, agentId });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-muted-foreground">Loading agent...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-destructive">Failed to load agent.</span>
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col space-y-8 overflow-y-auto">
      {/* Header */}
      <div className="w-full border-b px-8 py-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/agents"
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-xl">{agent.name}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-2xl">
        <Card className="pt-6">
          <CardContent className="space-y-4">
            <div>
              <span className="font-semibold">Description:</span>
              <p>{agent.description || ""}</p>
            </div>
            <div>
              <span className="font-semibold">Model:</span> {agent.model_name}
            </div>
            <div>
              <span className="font-semibold">Public:</span>{" "}
              {agent.is_public ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-semibold">Tools:</span>
              <ul className="ml-6 list-disc">
                {agent.tools && agent.tools.length > 0 ? (
                  agent.tools.map((tool) => (
                    <li key={tool.id}>
                      <span className="font-semibold">{tool.name}</span>{" "}
                      <span className="text-muted-foreground text-xs">
                        ({tool.description})
                      </span>
                    </li>
                  ))
                ) : (
                  <li>-</li>
                )}
              </ul>
            </div>
            <div>
              <span className="font-semibold">Triggers:</span>
              <ul className="ml-6 list-disc">
                {agent.triggers && agent.triggers.length > 0 ? (
                  agent.triggers.map((trigger) => (
                    <li key={trigger.id}>
                      <span className="font-semibold">{trigger.name}</span>{" "}
                      <span className="text-muted-foreground text-xs">
                        ({trigger.type})
                      </span>
                    </li>
                  ))
                ) : (
                  <li>-</li>
                )}
              </ul>
            </div>
            <div>
              <span className="font-semibold">Memories:</span>
              <ul className="ml-6 list-disc">
                {agent.memories && agent.memories.length > 0 ? (
                  agent.memories.map((memory) => (
                    <li key={memory.id}>{memory.id}</li>
                  ))
                ) : (
                  <li>-</li>
                )}
              </ul>
            </div>
            <div>
              <span className="font-semibold">Wallets:</span>
              <ul className="ml-6 list-disc">
                {agent.wallets && agent.wallets.length > 0 ? (
                  agent.wallets.map((wallet) => (
                    <li key={wallet.id}>
                      <span className="font-semibold">
                        {wallet.address.slice(0, 6)}...
                        {wallet.address.slice(-4)}
                      </span>{" "}
                      <span className="text-muted-foreground text-xs">
                        ({wallet.type})
                      </span>
                    </li>
                  ))
                ) : (
                  <li>-</li>
                )}
              </ul>
            </div>
            <div className="text-muted-foreground text-xs">
              <div>
                Created at: {new Date(agent.created_at).toLocaleString()}
              </div>
              <div>
                Updated at: {new Date(agent.updated_at).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
