import { FooterLinksSection } from "../components/footer/FooterLinksSection";

export default function Layout(props: { children: React.ReactNode }) {
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
      center={{
        links: [
          {
            href: "https://www.youtube.com/watch?v=xrm0emiRGMk",
            label: "Build a Telegram Mini App ERC20 deployer, powered by AI",
          },
          {
            href: "https://www.youtube.com/watch?v=vBooJytkXa4",
            label: "Build an AI Powered Blockchain Explorer",
          },
        ],
        title: "Tutorials",
      }}
      left={{
        links: [
          {
            href: "https://portal.thirdweb.com/nebula/get-started",
            label: "API Reference",
          },
          {
            href: "https://portal.thirdweb.com/nebula/tools/python-sdk/installation",
            label: "Python SDK",
          },
          {
            href: "https://portal.thirdweb.com/nebula/mcp-server/get-started",
            label: "MCP Server",
          },
        ],
        title: "Documentation",
      }}
      right={{
        links: [
          {
            href: "https://github.com/thirdweb-example/bouncer-eliza-agent",
            label: "Bouncer Eliza Agent",
          },
          {
            href: "https://github.com/thirdweb-example/nebula-block-explorer",
            label: "Block Explorer",
          },
          {
            href: "https://github.com/thirdweb-example/erc20-token-deployer",
            label: "ERC20 Telegram Mini-app Token Deployer",
          },
        ],
        title: "Templates",
      }}
    />
  );
}
