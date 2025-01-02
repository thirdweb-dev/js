import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { ExternalLinkIcon } from "lucide-react";

export const DeployUpsellCard: React.FC = () => {
  return (
    <section className="rounded-xl border border-border px-4 py-6 shadow-lg md:px-8 md:py-14">
      <h3 className="font-bold text-2xl tracking-tight">
        Didn't find what you're looking for? Build your own!
      </h3>

      <div className="h-8" />

      <p className="text-muted-foreground ">
        Create a contract with a single command.{" "}
        <TrackedLinkTW
          category="deploy_upsell"
          label="contract_kit"
          className="inline-flex items-center gap-1.5 text-link-foreground"
          href="https://portal.thirdweb.com/contracts/build/overview"
          target="_blank"
        >
          Learn more about the Solidity SDK
          <ExternalLinkIcon className="size-4" />
        </TrackedLinkTW>
      </p>

      <div className="h-2" />

      <PlainTextCodeBlock code="npx thirdweb create contract" />

      <div className="h-8" />

      <p className="text-muted-foreground ">
        Deploy a contract with a single command.{" "}
        <TrackedLinkTW
          category="deploy_upsell"
          label="portal_deploy"
          className="inline-flex items-center gap-1.5 text-link-foreground"
          href="https://portal.thirdweb.com/contracts/deploy/overview"
          target="_blank"
        >
          Learn more about Deploy
          <ExternalLinkIcon className="size-4" />
        </TrackedLinkTW>
      </p>

      <div className="h-2" />

      <PlainTextCodeBlock code="npx thirdweb deploy" />
    </section>
  );
};
