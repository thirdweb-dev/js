import { FooterLinksSection } from "../../components/footer/FooterLinksSection";

export function AAFooter() {
  return (
    <FooterLinksSection
      trackingCategory="account-abstraction"
      left={{
        title: "Documentation",
        links: [
          {
            href: "https://portal.thirdweb.com/connect/account-abstraction/overview",
            label: "Overview",
          },
          {
            href: "https://portal.thirdweb.com/typescript/v5/account-abstraction/get-started",
            label: "Typescript",
          },
          {
            href: "https://portal.thirdweb.com/react/v5/account-abstraction/get-started",
            label: "React",
          },
          {
            href: "https://portal.thirdweb.com/react/v5/account-abstraction/get-started",
            label: "React Native",
          },
          {
            href: "https://portal.thirdweb.com/dotnet/wallets/providers/account-abstraction",
            label: ".NET",
          },
          {
            href: "https://portal.thirdweb.com/unity/v5/wallets/account-abstraction",
            label: "Unity",
          },
          {
            href: "https://portal.thirdweb.com/unreal-engine/blueprints/smart-wallet",
            label: "Unreal Engine",
          },
        ],
      }}
      right={{
        title: "Tutorials",
        links: [
          {
            label: "Web3 onboarding with in-app wallets and AA",
            href: "https://www.youtube.com/watch?v=HP8wSH7gnQA",
          },
          {
            label: "Multi-chain experience with account abstraction",
            href: "https://www.youtube.com/watch?v=2wUtq-drxAk",
          },
          {
            label: "Add AA to a web3 unity game",
            href: "https://www.youtube.com/watch?v=04G4DLhqwgI",
          },
        ],
      }}
      center={{
        title: "Demos",
        links: [
          {
            label: "Connect Smart Accounts",
            href: "https://playground.thirdweb.com/connect/account-abstraction/connect",
          },
          {
            label: "Sponsor Gas Fees",
            href: "https://playground.thirdweb.com/connect/account-abstraction/sponsor",
          },
          {
            label: "Native Account Abstraction",
            href: "https://playground.thirdweb.com/connect/account-abstraction/native-aa",
          },
        ],
      }}
    />
  );
}
