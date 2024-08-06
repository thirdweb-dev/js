import { Book, BookIcon, CodeIcon, ExternalLink, ZapIcon } from "lucide-react";
import type { SideBar } from "../../../components/Layouts/DocLayout";
import { fetchTypeScriptDoc } from "../../references/components/TDoc/fetchDocs/fetchTypeScriptDoc";
import { getCustomTag } from "../../references/components/TDoc/utils/getSidebarLinkgroups";
import { TypeScriptIcon } from "../../../icons";

const slug = "/react/v5";
const docs = await fetchTypeScriptDoc("v5");

export const sidebar: SideBar = {
  name: "Connect React SDK",
  links: [
    {
      separator: true,
    },
    {
      name: "Overview",
      href: slug,
    },
    {
      name: "Getting Started",
      href: `${slug}/getting-started`,
      icon: <ZapIcon />,
    },
    {
      name: "Live Playground",
      href: "https://playground.thirdweb.com/",
      icon: <ExternalLink />,
    },
    {
      separator: true,
    },
    {
      name: "Core",
      isCollapsible: false,
      links: [
        {
          name: "Client",
          href: `${slug}/createThirdwebClient`,
        },
        {
          name: "ThirdwebProvider",
          href: `${slug}/ThirdwebProvider`,
        },
        {
          name: "Themes",
          links: [
            {
              name: "Theme Props",
              href: `${slug}/Theme`,
              icon: <CodeIcon />,
            },
            ...(docs.functions
              ?.filter((f) => {
                const [tag] = getCustomTag(f) || [];
                return tag === "@theme";
              })
              ?.map((f) => ({
                name: f.name,
                href: `${slug}/${f.name}`,
                icon: <CodeIcon />,
              })) || []),
          ],
        },
        {
          name: "TS reference",
          href: "/typescript/v5",
          icon: <TypeScriptIcon />,
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "Wallets",
      isCollapsible: false,
      links: [
        {
          name: "UI Components",
          links: [
            {
              name: "Introduction",
              href: `${slug}/connecting-wallets/ui-components`,
              icon: <Book />,
            },
            ...["ConnectButton", "ConnectEmbed", "AutoConnect"].map((name) => ({
              name,
              href: `${slug}/${name}`,
              icon: <CodeIcon />,
            })),
          ],
        },
        {
          name: "Connection Hooks",
          links: [
            {
              name: "Introduction",
              href: `${slug}/connecting-wallets/hooks`,
              icon: <Book />,
            },
            ...(docs.hooks
              ?.filter((hook) => {
                const [tag] = getCustomTag(hook) || [];
                return tag === "@walletConnection";
              })
              ?.map((hook) => ({
                name: hook.name,
                href: `${slug}/${hook.name}`,
                icon: <CodeIcon />,
              })) || []),
          ],
        },
        {
          name: "Wallet Hooks",
          links:
            docs.hooks
              ?.filter((hook) => {
                const [tag] = getCustomTag(hook) || [];
                return tag === "@wallet";
              })
              ?.map((hook) => ({
                name: hook.name,
                href: `${slug}/${hook.name}`,
                icon: <CodeIcon />,
              })) || [],
        },
        {
          name: "In-App Wallets",
          links: [
            {
              name: "Get Started",
              href: `${slug}/in-app-wallet/get-started`,
              icon: <ZapIcon />,
            },
            {
              name: "Sponsor Transactions",
              href: `${slug}/in-app-wallet/enable-gasless`,
              icon: <BookIcon />,
            },
            {
              name: "Build your own UI",
              href: `${slug}/in-app-wallet/build-your-own-ui`,
              icon: <BookIcon />,
            },
            {
              name: "Export Private Key",
              href: `${slug}/in-app-wallet/export-private-key`,
              icon: <BookIcon />,
            },
            ...[
              "inAppWallet",
              "preAuthenticate",
              "getUserEmail",
              "getUserPhoneNumber",
              "hasStoredPasskey",
            ].map((name) => ({
              name,
              href: `${slug}/${name}`,
              icon: <CodeIcon />,
            })),
          ],
        },
        {
          name: "Account Abstraction",
          links: [
            {
              name: "Get Started",
              href: `${slug}/account-abstraction/get-started`,
              icon: <Book />,
            },
            {
              name: "Build your own UI",
              href: `${slug}/account-abstraction/build-your-own-ui`,
              icon: <Book />,
            },
            {
              name: "Admins & Session Keys",
              href: `${slug}/account-abstraction/permissions`,
              icon: <Book />,
            },
            {
              name: "Batching Transactions",
              href: `${slug}/account-abstraction/batching-transactions`,
              icon: <Book />,
            },
            {
              name: "Core API",
              href: "/typescript/v5/smartWallet",
              icon: <TypeScriptIcon />,
            },
          ],
        },
        {
          name: "All Supported Wallets",
          href: "/typescript/v5/supported-wallets",
          icon: <TypeScriptIcon />,
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "Pay",
      isCollapsible: false,
      links: [
        {
          name: "UI Components",
          links: ["PayEmbed"].map((name) => ({
            name,
            href: `${slug}/${name}`,
            icon: <CodeIcon />,
          })),
        },
        {
          name: "Buy with Fiat",
          links:
            docs.hooks
              ?.filter((f) => {
                const [tag] = getCustomTag(f) || [];
                return tag === "@buyCrypto" && f.name.includes("Fiat");
              })
              ?.map((f) => ({
                name: f.name,
                href: `${slug}/${f.name}`,
                icon: <CodeIcon />,
              })) || [],
        },
        {
          name: "Buy with Crypto",
          links:
            docs.hooks
              ?.filter((f) => {
                const [tag] = getCustomTag(f) || [];
                return tag === "@buyCrypto" && f.name.includes("Crypto");
              })
              ?.map((f) => ({
                name: f.name,
                href: `${slug}/${f.name}`,
                icon: <CodeIcon />,
              })) || [],
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "Blockchain API",
      isCollapsible: false,
      links: [
        {
          name: "UI Components",
          links: ["ClaimButton", "TransactionButton", "MediaRenderer"].map(
            (name) => ({
              name,
              href: `${slug}/${name}`,
              icon: <CodeIcon />,
            }),
          ),
        },
        {
          name: "Reading State",
          links: [
            {
              name: "Introduction",
              href: `${slug}/reading-state`,
              icon: <Book />,
            },
            ...(docs.hooks
              ?.filter((hook) => {
                const [tag] = getCustomTag(hook) || [];
                return tag === "@contract";
              })
              ?.map((hook) => ({
                name: hook.name,
                href: `${slug}/${hook.name}`,
                icon: <CodeIcon />,
              })) || []),
          ],
        },
        {
          name: "Transactions",
          links: [
            {
              name: "Introduction",
              href: `${slug}/transactions`,
              icon: <Book />,
            },
            ...(docs.hooks
              ?.filter((hook) => {
                const [tag] = getCustomTag(hook) || [];
                return tag === "@transaction";
              })
              ?.map((hook) => ({
                name: hook.name,
                href: `${slug}/${hook.name}`,
                icon: <CodeIcon />,
              })) || []),
          ],
        },
        {
          name: "Extensions",
          links: [
            {
              name: "Using Extensions",
              href: `${slug}/extensions`,
              icon: <Book />,
            },
            {
              name: "Available Extensions",
              href: "/typescript/v5/extensions/built-in",
              icon: <TypeScriptIcon />,
            },
          ],
        },
        {
          name: "Core API",
          href: "/typescript/v5/chain",
          icon: <TypeScriptIcon />,
        },
      ],
    },
    { separator: true },
    {
      name: "Migrate from v4",
      href: `${slug}/migrate`,
      links: [
        {
          name: "Installation",
          href: `${slug}/migrate/installation`,
        },
        {
          name: "Interacting with contracts",
          href: `${slug}/migrate/contracts`,
        },
        {
          name: "ethers.js Adapter",
          href: `${slug}/migrate/ethers-adapter`,
        },
        {
          name: "Cheatsheet",
          href: `${slug}/migrate/cheatsheet`,
        },
      ],
    },
    {
      name: "Migrate from RainbowKit",
      href: `${slug}/rainbow-kit-migrate`,
    },
    {
      name: "Full Reference",
      href: "/references/typescript/v5",
      isCollapsible: false,
    },
  ],
};
