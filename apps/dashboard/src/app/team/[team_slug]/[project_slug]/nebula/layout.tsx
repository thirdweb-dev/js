import { FooterLinksSection } from "../components/footer/FooterLinksSection";

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow flex-col">
      <div className="flex grow flex-col">{props.children}</div>
      <div className="h-20" />
      <div className="border-t">
        <div className="container max-w-7xl">
          <NebulaFooter />
        </div>
      </div>
    </div>
  );
}

function NebulaFooter() {
  return (
    <FooterLinksSection
      trackingCategory="nebula"
      left={{
        title: "Documentation",
        links: [
          {
            label: "API Reference",
            href: "https://portal.thirdweb.com/nebula/get-started",
          },
          {
            label: "Python SDK",
            href: "https://portal.thirdweb.com/nebula/tools/python-sdk/installation",
          },
          {
            label: "MCP Server",
            href: "https://portal.thirdweb.com/nebula/mcp-server/get-started",
          },
        ],
      }}
      center={{
        title: "Tutorials",
        links: [
          {
            href: "https://www.youtube.com/watch?v=xrm0emiRGMk",
            label: "Build a Telegram Mini App ERC20 deployer, powered by AI",
          },
          {
            label: "Build an AI Powered Blockchain Explorer",
            href: "https://www.youtube.com/watch?v=vBooJytkXa4",
          },
        ],
      }}
      right={{
        title: "Templates",
        links: [
          {
            label: "Bouncer Eliza Agent",
            href: "https://github.com/thirdweb-example/bouncer-eliza-agent",
          },
          {
            label: "Block Explorer",
            href: "https://github.com/thirdweb-example/nebula-block-explorer",
          },
          {
            label: "ERC20 Telegram Mini-app Token Deployer",
            href: "https://github.com/thirdweb-example/erc20-token-deployer",
          },
        ],
      }}
    />
  );
}
