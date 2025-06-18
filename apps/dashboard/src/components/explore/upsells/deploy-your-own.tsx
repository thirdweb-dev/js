import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export const DeployUpsellCard: React.FC = () => {
  return (
    <section className="rounded-xl border border-border px-4 py-6 shadow-lg md:px-8 md:py-14">
      <h3 className="font-bold text-2xl tracking-tight">
        Didn't find what you're looking for? Build your own!
      </h3>

      <div className="h-8" />

      <p className="text-muted-foreground ">
        Create a contract with a single command.{" "}
        <Link
          className="inline-flex items-center gap-1.5 text-link-foreground"
          href="https://portal.thirdweb.com/contracts/build/overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about the Solidity SDK
          <ExternalLinkIcon className="size-4" />
        </Link>
      </p>

      <div className="h-2" />

      <PlainTextCodeBlock code="npx thirdweb create contract" />

      <div className="h-8" />

      <p className="text-muted-foreground ">
        Deploy a contract with a single command.{" "}
        <Link
          className="inline-flex items-center gap-1.5 text-link-foreground"
          href="https://portal.thirdweb.com/contracts/deploy/overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about Deploy
          <ExternalLinkIcon className="size-4" />
        </Link>
      </p>

      <div className="h-2" />

      <PlainTextCodeBlock code="npx thirdweb deploy" />
    </section>
  );
};
