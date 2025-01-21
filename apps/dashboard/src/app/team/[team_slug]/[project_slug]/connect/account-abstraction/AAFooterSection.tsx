import { TrackedLinkTW } from "@/components/ui/tracked-link";

type LinkInfo = { label: string; href: string; trackingLabel: string };

export function AAFooterSection(props: {
  trackingCategory: string;
}) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <FooterCard
        title="Docs"
        links={docLinks}
        trackingCategory={props.trackingCategory}
      />

      <FooterCard
        title="Guides"
        links={guideLinks}
        trackingCategory={props.trackingCategory}
      />

      <FooterCard
        title="Templates"
        links={templateLinks}
        trackingCategory={props.trackingCategory}
      />
    </section>
  );
}

function FooterCard(props: {
  title: string;
  links: LinkInfo[];
  trackingCategory: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 lg:p-6">
      <h3 className="mb-5 font-semibold text-lg tracking-tight lg:text-xl">
        {props.title}
      </h3>

      <div className="flex flex-col gap-2">
        {props.links.map((link) => (
          <TrackedLinkTW
            key={link.href}
            href={link.href}
            category={props.trackingCategory}
            label={link.trackingLabel}
            target="_blank"
            className="text-muted-foreground text-sm hover:text-foreground"
          >
            {link.label}
          </TrackedLinkTW>
        ))}
      </div>
    </div>
  );
}

const docLinks: LinkInfo[] = [
  {
    label: "Full Docs",
    href: "https://portal.thirdweb.com/wallets/smart-wallet",
    trackingLabel: "full-docs",
  },
  {
    label: "Account Abstraction with React SDK",
    href: "https://portal.thirdweb.com/wallets/smart-wallet/guides/react",
    trackingLabel: "smart-wallet-react",
  },
  {
    label: "Account Abstraction with TypeScript SDK",
    href: "https://portal.thirdweb.com/wallets/smart-wallet/guides/typescript",
    trackingLabel: "smart-wallet-typescript",
  },
];

const guideLinks: LinkInfo[] = [
  {
    label: "Deploy a Smart Account (ERC-4337)",
    href: "https://blog.thirdweb.com/guides/how-to-use-erc4337-smart-wallets/",
    trackingLabel: "deploy-smart-wallet",
  },
  {
    label:
      "How to Extend the Base Account Abstraction Contracts Using the Solidity SDK",
    href: "https://blog.thirdweb.com/guides/custom-smart-wallet-contracts/",
    trackingLabel: "extend-base-smart-wallet",
  },
  {
    label: "Batch Transactions with Account Abstraction",
    href: "https://blog.thirdweb.com/guides/how-to-batch-transactions-with-the-thirdweb-sdk/",
    trackingLabel: "batch-txns",
  },
];

const templateLinks: LinkInfo[] = [
  {
    label: "Node.js template",
    trackingLabel: "node-template",
    href: "https://github.com/thirdweb-example/smart-wallet-script",
  },
  {
    label: "React template",
    trackingLabel: "react-template",
    href: "https://github.com/thirdweb-example/smart-wallet-react",
  },
];
