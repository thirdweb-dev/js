"use client";

import { DatabaseIcon, NetworkIcon, ShieldIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { ClientOnly } from "@/components/blocks/client-only";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { Badge } from "../../../../../../../../../@/components/ui/badge";
import { ChainIconClient } from "../../../../../../../../../@/icons/ChainIcon";
import { OrderSummary } from "./order-summary";
import {
  type PaymentFrequency,
  PaymentFrequencySelector,
} from "./payment-frequency-selector";
import { type ServiceConfig, ServiceSelector } from "./service-selector";

const services = {
  accountAbstraction: {
    description: "Smart wallets & gasless transactions",
    features: [
      "Fully managed Bundler & Paymaster",
      "Audited ERC-4337 smart wallets out of the box",
      "ERC-7702 support",
      "Session key support",
    ],
    icon: ShieldIcon,
    id: "account-abstraction" as const,
    monthlyPrice: 750,
    name: "Account Abstraction",
    upsellReason: " ",
  },
  insight: {
    description: "Instant, real-time data APIs, without the hassle",
    features: [
      "Comprehensive onchain data APIs",
      "Webhooks for real-time event streaming",
      "Instant wallet, token & NFT balance lookups",
      "Fully managed and battle-tested",
    ],
    icon: DatabaseIcon,
    id: "insight" as const,
    monthlyPrice: 2000,
    name: "Insight",
    upsellReason: " ",
  },
  rpc: {
    description: "Low-latency edge RPC with no node maintenance",
    features: [
      "Low-latency edge RPC",
      "Auto-scaling & global load balancing",
      "Smart caching & automatic failover",
      "Fully managed and battle-tested",
    ],
    icon: NetworkIcon,
    id: "rpc" as const,
    monthlyPrice: 2000,
    name: "RPC",
    required: true,
    upsellReason: " ",
  },
} satisfies Record<string, ServiceConfig>;

const serviceConfigs = [
  services.rpc,
  services.insight,
  services.accountAbstraction,
];

export function InfrastructureCheckout(props: { client: ThirdwebClient }) {
  const [selectedChain, setSelectedChain] = useState<number>(0);
  const { idToChain } = useAllChainsData();
  const [selectedServices, setSelectedServices] = useState<ServiceConfig[]>([
    services.rpc,
  ]);

  const selectedChainDetails = useMemo(() => {
    return idToChain.get(selectedChain);
  }, [idToChain, selectedChain]);

  const [paymentFrequency, setPaymentFrequency] =
    useState<PaymentFrequency>("monthly");

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Configuration Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Chain Selection */}
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <Badge className="font-mono" variant="outline">
                Step 1
              </Badge>
              Select Chain
            </CardTitle>
            <CardDescription>
              Choose the chain to deploy infrastructure on.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientOnly ssr={false}>
              <SingleNetworkSelector
                chainId={selectedChain}
                className="bg-background"
                client={props.client}
                disableDeprecated
                onChange={setSelectedChain}
                placeholder="Select a chain"
              />
            </ClientOnly>
          </CardContent>
        </Card>

        {/* Service Selection */}
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <Badge className="font-mono" variant="outline">
                Step 2
              </Badge>
              Select Services
            </CardTitle>
            <CardDescription>
              Choose the infrastructure services you need. RPC service is
              required for all other services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServiceSelector
              selectedServices={selectedServices}
              services={serviceConfigs}
              setSelectedServices={setSelectedServices}
            />
          </CardContent>
        </Card>

        {/* Payment Frequency */}
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <Badge className="font-mono" variant="outline">
                Step 3
              </Badge>
              Payment Frequency
            </CardTitle>
            <CardDescription>
              Choose your billing frequency. Save 15% with annual payment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentFrequencySelector
              annualDiscountPercent={15}
              paymentFrequency={paymentFrequency}
              setPaymentFrequency={setPaymentFrequency}
            />
          </CardContent>
        </Card>
      </div>

      {/* Pricing Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader className="space-y-2">
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              {selectedChainDetails ? (
                <div className="flex justify-between gap-4">
                  <span className="flex grow gap-2 truncate text-left">
                    <ChainIconClient
                      className="size-5"
                      client={props.client}
                      loading="lazy"
                      src={selectedChainDetails.icon?.url}
                    />
                    {selectedChainDetails.name}
                  </span>
                  <Badge className="gap-2 max-sm:hidden" variant="outline">
                    <span className="text-muted-foreground">Chain ID</span>
                    {selectedChainDetails.chainId}
                  </Badge>
                </div>
              ) : (
                <span className="text-muted-foreground">Select a chain</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderSummary
              paymentFrequency={paymentFrequency}
              selectedChainId={selectedChain}
              selectedServices={selectedServices}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
