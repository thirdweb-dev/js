import { TrackedLinkTW } from "@/components/ui/tracked-link";

export function PageHeader() {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
        Account Abstraction
      </h1>

      <p className="text-muted-foreground text-sm">
        Easily integrate Account abstraction (ERC-4337) compliant smart accounts
        into your apps.{" "}
        <TrackedLinkTW
          target="_blank"
          label="docs-wallets"
          category="smart-wallet"
          href="https://portal.thirdweb.com/wallets/smart-wallet"
          className="text-link-foreground hover:text-foreground"
        >
          View Documentation
        </TrackedLinkTW>
      </p>
    </div>
  );
}
