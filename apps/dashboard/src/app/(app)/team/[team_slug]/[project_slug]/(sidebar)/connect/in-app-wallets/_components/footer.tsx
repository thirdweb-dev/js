import { FooterLinksSection } from "../../../components/footer/FooterLinksSection";

export function InAppWalletsFooter() {
  return (
    <FooterLinksSection
      left={{
        title: "Documentation",
        links: [
          {
            href: "https://portal.thirdweb.com/connect/wallet/overview",
            label: "Overview",
          },
          {
            href: "https://portal.thirdweb.com/typescript/v5/in-app-wallet",
            label: "Typescript",
          },
          {
            href: "https://portal.thirdweb.com/react/v5/in-app-wallet/get-started",
            label: "React",
          },
          {
            href: "https://portal.thirdweb.com/react/v5/in-app-wallet/get-started",
            label: "React Native",
          },
          {
            href: "https://portal.thirdweb.com/dotnet/wallets/providers/in-app-wallet",
            label: ".NET",
          },
          {
            href: "https://portal.thirdweb.com/unity/v5/wallets/in-app-wallet",
            label: "Unity",
          },
          {
            href: "https://portal.thirdweb.com/unreal-engine/blueprints/in-app-wallet",
            label: "Unreal Engine",
          },
        ],
      }}
      center={{
        title: "Tutorials",
        links: [
          {
            href: "https://www.youtube.com/watch?v=9s3Z-MvPv2I",
            label: "Build your own custom connect component",
          },
          {
            label: "Learn to create wallets inside a Unity game",
            href: "https://www.youtube.com/watch?v=oUouNueoVFU",
          },
          {
            href: "https://www.youtube.com/watch?v=xEp-fKba_cI",
            label: "Pre-generate wallets for users",
          },
          {
            label: "Sign-in with guest mode",
            href: "https://portal.thirdweb.com/connect/wallet/sign-in-methods/guest",
          },
        ],
      }}
      right={{
        title: "Demos",
        links: [
          {
            href: "https://playground.thirdweb.com/connect/in-app-wallet/ecosystem",
            label: "Ecosystems",
          },
          {
            href: "https://playground.thirdweb.com/connect/in-app-wallet/sponsor",
            label: "Signless Sponsored Transactions",
          },
          {
            href: "https://playground.thirdweb.com/connect/in-app-wallet",
            label: "Customized UI",
          },
        ],
      }}
    />
  );
}
