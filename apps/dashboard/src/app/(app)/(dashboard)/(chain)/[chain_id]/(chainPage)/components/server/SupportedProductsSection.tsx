import { BotIcon, CodeIcon, CoinsIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { PayIcon } from "@/icons/PayIcon";
import { WalletProductIcon } from "@/icons/WalletProductIcon";
import type {
  ChainMetadataWithServices,
  ChainSupportedService,
} from "@/types/chain";
import { SectionTitle } from "./SectionTitle";

export function SupportedProductsSection(props: {
  services: ChainMetadataWithServices["services"];
}) {
  const enabledServices = useMemo(() => {
    return props.services.reduce(
      (acc, service) => {
        acc[service.service] = service.enabled;
        return acc;
      },
      {} as Record<ChainSupportedService, boolean>,
    );
  }, [props.services]);

  return (
    <section>
      <SectionTitle title="thirdweb Products" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {enabledServices["connect-sdk"] && (
          <ProductCard
            icon={WalletProductIcon}
            name="Wallets"
            description="Create wallets to read and transact"
            link="https://thirdweb.com/wallets"
          />
        )}

        {enabledServices["account-abstraction"] && (
          <ProductCard
            icon={PayIcon}
            name="x402"
            description="Create internet native payments with x402"
            link="https://thirdweb.com/x402"
          />
        )}

        {enabledServices.pay && (
          <ProductCard
            icon={BridgeIcon}
            name="Bridge"
            description="Bridge and swap tokens across chains"
            link="https://thirdweb.com/monetize/bridge"
          />
        )}

        {enabledServices.contracts && (
          <ProductCard
            icon={CoinsIcon}
            name="Tokens"
            description="Launch tokens and markets"
            link="https://thirdweb.com/token"
          />
        )}

        <ProductCard
          icon={BotIcon}
          name="AI"
          description="Read and write onchain via natural language"
          link="https://thirdweb.com/ai"
        />

        <ProductCard
          icon={CodeIcon}
          name="HTTP API"
          description="Build products with our HTTP API"
          link="https://portal.thirdweb.com/reference"
        />
      </div>
    </section>
  );
}

function ProductCard(props: {
  icon: React.FC<{ className?: string }>;
  link: string;
  name: string;
  description: string;
}) {
  return (
    <div className="relative rounded-xl border bg-card p-4 hover:border-active-border">
      <div className="flex mb-4">
        <div className="p-2 rounded-full border bg-background">
          <props.icon className="size-4 text-muted-foreground" />
        </div>
      </div>
      <div>
        <h3 className="mb-1">
          <Link
            className="before:absolute before:inset-0 text-base font-medium"
            href={props.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            {props.name}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm">{props.description}</p>
      </div>
    </div>
  );
}
