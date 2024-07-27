import { ExternalLinkIcon } from "lucide-react";
import { CodeBlock } from "tw-components";
import { TrackedLinkTW } from "../../../@/components/ui/tracked-link";

export const DeployUpsellCard: React.FC = () => {
  return (
    <section className="px-4 py-6 md:px-8 md:py-14 border-border border rounded-xl shadow-lg">
      <h3 className="font-bold tracking-tight text-2xl">
        {`Didn't find what you're looking for? Build your own!`}
      </h3>

      <div className="h-8" />

      <p className="text-secondary-foreground ">
        Create a contract with a single command.{" "}
        <TrackedLinkTW
          category="deploy_upsell"
          label="contract_kit"
          className="text-link-foreground inline-flex items-center gap-1.5"
          href="https://portal.thirdweb.com/contracts/build/overview"
          target="_blank"
        >
          Learn more about the Solidity SDK
          <ExternalLinkIcon className="size-4" />
        </TrackedLinkTW>
      </p>

      <div className="h-2" />

      <CodeBlock
        code="npx thirdweb create contract"
        language="bash"
        prefix="$"
      />

      <div className="h-8" />

      <p className="text-secondary-foreground ">
        Deploy a contract with a single command.{" "}
        <TrackedLinkTW
          category="deploy_upsell"
          label="portal_deploy"
          className="text-link-foreground inline-flex items-center gap-1.5"
          href="https://portal.thirdweb.com/contracts/deploy/overview"
          target="_blank"
        >
          Learn more about Deploy
          <ExternalLinkIcon className="size-4" />
        </TrackedLinkTW>
      </p>

      <div className="h-2" />

      <CodeBlock code="npx thirdweb deploy" language="bash" prefix="$" />
    </section>
  );
};
