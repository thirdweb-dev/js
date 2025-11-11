"use client";

import { BotIcon, ServerIcon, WalletIcon } from "lucide-react";
import { FeatureCard } from "../payments/components/FeatureCard.client";

export function QuickStartSection() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-semibold text-xl tracking-tight">Quick Start</h2>
        <p className="text-muted-foreground text-sm">
          Choose how to integrate x402 payments into your project.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Payment gate your API"
          description="Make your endpoints payable with a single line of code"
          icon={ServerIcon}
          id="x402_server"
          setupTime={2}
          features={[
            "Supports 170+ chains",
            "Supports 6.7k+ tokens",
            "Dynamic pricing logic",
          ]}
          link={{
            href: "https://portal.thirdweb.com/x402/server",
            label: "Get Started",
          }}
        />

        <FeatureCard
          title="Let your users pay for x402 resources"
          description="Handle x402 payments from any user wallet in your apps"
          icon={WalletIcon}
          id="x402_client"
          setupTime={2}
          features={[
            "Works with any wallet",
            "No gas required",
            "One line of code",
          ]}
          link={{
            href: "https://portal.thirdweb.com/x402/client",
            label: "Get Started",
          }}
        />

        <FeatureCard
          title="Equip your agents with x402 tools"
          description="Give your AI agents a wallet and the ability to pay for any x402 resource"
          icon={BotIcon}
          id="x402_agents"
          setupTime={2}
          features={[
            "Remote MCP server",
            "Low level APIs",
            "Works with any AI framework",
          ]}
          link={{
            href: "https://portal.thirdweb.com/x402/agents",
            label: "Get Started",
          }}
        />
      </div>
    </section>
  );
}
