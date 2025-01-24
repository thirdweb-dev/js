import { CodeIcon, ExternalLink, ZapIcon } from "lucide-react";
import type { SideBar } from "../../../components/Layouts/DocLayout";
import { fetchTypeScriptDoc } from "../../references/components/TDoc/fetchDocs/fetchTypeScriptDoc";
import { getCustomTag } from "../../references/components/TDoc/utils/getSidebarLinkgroups";

const slug = "/typescript/v5";
const docs = await fetchTypeScriptDoc();

export const sidebar: SideBar = {
  name: "Connect Typescript SDK",
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
      name: "API Reference",
      href: "/references/typescript/v5",
      icon: <CodeIcon />,
    },
    { separator: true },
    {
      name: "Core Concepts",
      isCollapsible: false,
      links: [
        {
          name: "Client",
          href: `${slug}/client`,
        },
        {
          name: "Chains",
          href: `${slug}/chain`,
        },
        {
          name: "Contracts",
          href: `${slug}/contract`,
        },
        {
          name: "Accounts & Wallets",
          href: `${slug}/wallets`,
        },
      ],
    },
    { separator: true },
    {
      name: "Onboarding Users",
      isCollapsible: false,
      links: [
        {
          name: "External Wallets",
          href: `${slug}/supported-wallets`,
        },
        {
          name: "In-App Wallets",
          href: `${slug}/in-app-wallet`,
        },
        {
          name: "Ecosystem Wallets",
          href: `${slug}/ecosystem-wallet`,
        },
        {
          name: "Account Abstraction",
          links: [
            {
              name: "Getting Started",
              href: `${slug}/account-abstraction/get-started`,
            },
            {
              name: "Batching Transactions",
              href: `${slug}/account-abstraction/batching-transactions`,
            },
          ],
        },
      ],
    },
    { separator: true },
    {
      name: "Identity Management",
      isCollapsible: false,
      links: [
        {
          name: "Sign In With Ethereum",
          href: `${slug}/auth`,
        },
        {
          name: "Link Profiles",
          href: `${slug}/linkProfile`,
        },
        {
          name: "Web3 Social Identities",
          href: `${slug}/getSocialProfiles`,
        },
        {
          name: "Permissions",
          href: `${slug}/account-abstraction/permissions`,
        },
      ],
    },
    { separator: true },
    {
      name: "Onchain Interactions",
      isCollapsible: false,
      links: [
        {
          name: "Reading state",
          href: `${slug}/transactions/read`,
        },
        {
          name: "Preparing transactions",
          href: `${slug}/transactions/prepare`,
        },
        {
          name: "Sending transactions",
          href: `${slug}/transactions/send`,
        },
        {
          name: "Extensions",
          links: [
            {
              name: "Using Extensions",
              href: `${slug}/extensions/use`,
            },
            {
              name: "Generating Extensions",
              href: `${slug}/extensions/generate`,
            },
            {
              name: "Writing Extensions",
              href: `${slug}/extensions/create`,
            },
            {
              name: "Available Extensions",
              href: `${slug}/extensions/built-in`,
            },
            {
              name: "Examples",
              links: [
                {
                  name: "Lens Protocol",
                  href: `${slug}/extensions/examples/lens-protocol`,
                },
                {
                  name: "Transfering tokens",
                  href: `${slug}/extensions/examples/transfering-tokens`,
                },
                {
                  name: "Ethereum Name Service",
                  href: `${slug}/extensions/examples/ethereum-name-service`,
                },
              ],
            },
          ],
        },
        {
          name: "Deploying contracts",
          links:
            docs.functions
              ?.filter((f) => {
                const [tag, extensionName] = getCustomTag(f) || [];
                return tag === "@extension" && extensionName === "DEPLOY";
              })
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((f) => ({
                name: f.name,
                href: `${slug}/deploy/${f.name}`,
              })) || [],
        },
        {
          name: "Modular contracts",
          links: [
            {
              name: "Introduction",
              href: `${slug}/modular`,
            },
            {
              name: "Deploying",
              href: `${slug}/modular/deploy`,
            },
            {
              name: "Upgrading",
              href: `${slug}/modular/upgrade`,
            },
            {
              name: "Interacting",
              href: `${slug}/modular/interact`,
            },
            {
              name: "Available Modules",
              href: `${slug}/modular/built-in`,
            },
          ],
        },
        {
          name: "RPC Methods",
          links:
            docs.functions
              ?.filter((f) => {
                const [tag] = getCustomTag(f) || [];
                return tag === "@rpc";
              })
              ?.map((f) => ({
                name: f.name,
                href: `${slug}/${f.name}`,
              })) || [],
        },
        {
          name: "IPFS Storage",
          href: `${slug}/storage`,
        },
        {
          name: "Pay with Fiat",
          links:
            docs.functions
              ?.filter((f) => {
                const [tag] = getCustomTag(f) || [];
                return tag === "@buyCrypto" && f.name.includes("Fiat");
              })
              ?.map((f) => ({
                name: f.name,
                href: `${slug}/${f.name}`,
              })) || [],
        },
        {
          name: "Bridge & Swap",
          links:
            docs.functions
              ?.filter((f) => {
                const [tag] = getCustomTag(f) || [];
                return tag === "@buyCrypto" && f.name.includes("Crypto");
              })
              ?.map((f) => ({
                name: f.name,
                href: `${slug}/${f.name}`,
              })) || [],
        },
      ],
    },
    { separator: true },
    {
      name: "Usage with other libraries",
      href: `${slug}/adapters`,
    },
    {
      name: "Migrate from v4",
      href: `${slug}/migrate`,
    },
  ],
};
