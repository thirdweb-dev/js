import { ExternalLinkIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";
import { DotNetIcon, ReactIcon, TypeScriptIcon, UnityIcon } from "@/icons";
import { UnrealEngineIcon } from "../../icons/sdks/UnrealEngineIcon";

// TODO: move the following two slugs to walletSlug with updated docs
const inAppSlug = "/wallets/in-app-wallet";

const walletSlug = "/wallets/wallet";
const aAslug = "/wallets/account-abstraction";
const authSlug = "/wallets/auth";

export const sidebar: SideBar = {
  links: [
    { separator: true },
    {
      href: "/wallets",
      name: "Overview",
    },
    {
      href: "https://playground.thirdweb.com/",
      icon: <ExternalLinkIcon />,
      name: "Playground",
    },
    {
      href: "https://thirdweb.com/templates",
      icon: <ExternalLinkIcon />,
      name: "Templates",
    },
    { separator: true },
    // Connect\
    {
      expanded: true,
      isCollapsible: false,
      links: [
        {
          href: `${walletSlug}/overview`,
          name: "Overview",
        },
        {
          href: `${walletSlug}/security`,
          name: "Security",
        },
        {
          href: `${walletSlug}/get-started`,
          name: "Get Started",
        },
        {
          href: `${walletSlug}/sign-in-methods/external-wallets`,
          name: "External Wallets",
        },
        {
          links: [
            {
              href: `${walletSlug}/sign-in-methods/configure`,
              name: "Sign-In Methods",
            },
            {
              href: `${walletSlug}/get-users`,
              name: "Fetch Users",
            },
            {
              href: `${walletSlug}/pregenerate-wallets`,
              name: "Pregenerate Wallets",
            },
            {
              href: `${walletSlug}/sign-in-methods/guest`,
              name: "Guest Mode",
            },
            {
              href: `${walletSlug}/in-app-wallet/faq`,
              name: "FAQ",
            },
            {
              links: [
                {
                  href: `${inAppSlug}/custom-auth/overview`,
                  name: "Overview",
                },
                {
                  href: `${inAppSlug}/custom-auth/configuration`,
                  name: "Configuration",
                },
                {
                  links: [
                    {
                      href: `${inAppSlug}/custom-auth/custom-jwt-auth-server`,
                      name: "Custom auth server (OIDC Auth)",
                    },
                    {
                      href: `${inAppSlug}/custom-auth/custom-auth-server`,
                      name: "Custom auth server (Generic Auth)",
                    },
                    {
                      href: `${inAppSlug}/custom-auth/firebase-auth`,
                      name: "Firebase Auth",
                    },
                  ],
                  name: "Integration guides",
                },
              ],
              name: "Custom Authentication",
            },
          ],
          name: "In-App Wallets",
        },
        {
          links: [
            {
              href: `${walletSlug}/ecosystem/set-up`,
              name: "Set-up",
            },
            {
              href: `${walletSlug}/ecosystem/portal`,
              name: "Ecosystem Portal",
            },
            {
              href: `${walletSlug}/ecosystem/permissions`,
              name: "Managing Ecosystem Permissions",
            },
            {
              href: `${walletSlug}/ecosystem/integrating-partners`,
              name: "Integrating with Partners",
            },
            {
              href: `${walletSlug}/ecosystem/register-walletconnect`,
              name: "Register with WalletConnect",
            },
            {
              href: `${walletSlug}/ecosystem/faq`,
              name: "FAQ",
            },
          ],
          name: "Ecosystem Wallets",
        },
        //Account abstraction
        {
          links: [
            {
              href: `${aAslug}/overview`,
              name: "Overview",
            },
            {
              href: `${aAslug}/how-it-works`,
              name: "How it Works",
            },
            {
              links: [
                {
                  href: "/typescript/v5/account-abstraction/get-started",
                  icon: <TypeScriptIcon />,
                  name: "TypeScript",
                },
                {
                  href: "/react/v5/account-abstraction/get-started",
                  icon: <ReactIcon />,
                  name: "React",
                },
                {
                  // TODO - add react-native dedicated page
                  href: "/react/v5/account-abstraction/get-started",
                  icon: <ReactIcon />,
                  name: "React Native",
                },
                {
                  href: "/dotnet/wallets/providers/account-abstraction",
                  icon: <DotNetIcon />,
                  name: "Dotnet",
                },
                {
                  href: "/unity/wallets/providers/account-abstraction",
                  icon: <UnityIcon />,
                  name: "Unity",
                },
              ],
              name: "Get Started",
            },
            {
              href: `${aAslug}/erc-20-paymaster`,
              name: "ERC-20 Paymaster",
            },
            {
              href: `${aAslug}/factories`,
              name: "Account Factories",
            },
            {
              href: `${aAslug}/infrastructure`,
              name: "Bundler & Paymaster",
            },
            {
              href: `${aAslug}/sponsorship-rules`,
              name: "Sponsorship rules",
            },
            {
              href: `${aAslug}/api`,
              name: "API Reference",
            },
            {
              href: `${aAslug}/faq`,
              name: "FAQs",
            },
          ],
          name: "Account Abstraction",
        },
        {
          links: [
            {
              href: `${walletSlug}/web3-onboard/overview`,
              name: "Overview",
            },
            {
              href: `${walletSlug}/web3-onboard/migration-guide`,
              name: "Migration Guide",
            },
          ],
          name: "Web3 Onboard",
        },
        {
          href: `${walletSlug}/migrate-to-thirdweb`,
          name: "Migrate to thirdweb",
        },
        {
          href: `${walletSlug}/faq`,
          name: "FAQ",
        },
      ],
      name: "User Wallets",
    },
    { separator: true },
    // User identity
    {
      isCollapsible: false,
      links: [
        // Auth
        // TODO move to TS reference
        {
          links: [
            {
              href: `${authSlug}`,
              name: "Get Started",
            },
            {
              expanded: false,
              isCollapsible: true,
              links: [
                {
                  href: `${authSlug}/frameworks/next`,
                  name: "Next.js",
                },
                {
                  href: `${authSlug}/frameworks/react-express`,
                  name: "React + Express",
                },
              ],
              name: "Frameworks",
            },
            {
              href: `${authSlug}/deploying-to-production`,
              name: "Deploying to Production",
            },
          ],
          name: "Sign In with Ethereum",
        },
        {
          href: `${walletSlug}/user-management/get-user-profiles`,
          name: "Get User Profiles",
        },
        {
          href: `${walletSlug}/user-management/link-multiple-identity`,
          name: "Link Multiple Identities",
        },
        {
          href: `${walletSlug}/user-management/export-private-key`,
          name: "Export Private Keys",
        },
        // TODO:
        // {
        //   name: "Deleting User Details",
        //   href: `${walletSlug}/user-management/deleting-user-details`,
        // },
      ],
      name: "User Identity",
    },
    { separator: true },
    // Blockchain API
    // TODO Overview page?
    {
      isCollapsible: false,
      links: [
        {
          href: "/typescript/v5",
          icon: <TypeScriptIcon />,
          name: "TypeScript",
        },
        {
          href: "/react/v5",
          icon: <ReactIcon />,
          name: "React",
        },
        {
          href: "/react-native/v5",
          icon: <ReactIcon />,
          name: "React Native",
        },
        {
          href: "/dotnet",
          icon: <DotNetIcon />,
          name: "Dotnet",
        },
        {
          href: "/unity",
          icon: <UnityIcon />,
          name: "Unity",
        },
        {
          href: "/unreal-engine",
          icon: <UnrealEngineIcon />,
          name: "Unreal Engine",
        },
      ],
      name: "API References",
    },
  ],
  name: "Wallets",
};
