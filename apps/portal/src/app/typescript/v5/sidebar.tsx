import { CodeIcon, ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "../../../components/Layouts/DocLayout";
import { fetchTypeScriptDoc } from "../../references/components/TDoc/fetchDocs/fetchTypeScriptDoc";
import {
  getCustomTag,
  getExtensionName,
} from "../../references/components/TDoc/utils/getSidebarLinkgroups";

const slug = "/typescript/v5";
const docs = await fetchTypeScriptDoc();

export const sidebar: SideBar = {
  links: [
    {
      separator: true,
    },
    {
      href: slug,
      name: "Overview",
    },
    {
      href: `${slug}/getting-started`,
      icon: <ZapIcon />,
      name: "Getting Started",
    },
    {
      href: "https://playground.thirdweb.com/",
      icon: <ExternalLinkIcon />,
      name: "Live Playground",
    },
    {
      href: "/references/typescript/v5",
      icon: <CodeIcon />,
      name: "API Reference",
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `${slug}/client`,
          name: "Client",
        },
        {
          href: `${slug}/chain`,
          name: "Chains",
        },
        {
          href: `${slug}/contract`,
          name: "Contracts",
        },
        {
          href: `${slug}/wallets`,
          name: "Accounts & Wallets",
        },
      ],
      name: "Core Concepts",
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `${slug}/supported-wallets`,
          name: "External Wallets",
        },
        {
          href: `${slug}/in-app-wallet`,
          name: "In-App Wallets",
        },
        {
          href: `${slug}/ecosystem-wallet`,
          name: "Ecosystem Wallets",
        },
        {
          links: [
            {
              href: `${slug}/account-abstraction/get-started`,
              name: "Getting Started",
            },
            {
              href: `${slug}/account-abstraction/batching-transactions`,
              name: "Batching Transactions",
            },
          ],
          name: "Account Abstraction",
        },
      ],
      name: "Onboarding Users",
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `${slug}/auth`,
          name: "Sign In With Ethereum",
        },
        {
          href: `${slug}/linkProfile`,
          name: "Link Profiles",
        },
        {
          href: `${slug}/getSocialProfiles`,
          name: "Web3 Social Identities",
        },
        {
          href: `${slug}/account-abstraction/permissions`,
          name: "Permissions",
        },
      ],
      name: "Identity Management",
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `${slug}/transactions/read`,
          name: "Reading state",
        },
        {
          href: `${slug}/transactions/prepare`,
          name: "Preparing transactions",
        },
        {
          href: `${slug}/transactions/send`,
          name: "Sending transactions",
        },
        {
          links: [
            {
              href: `${slug}/extensions/use`,
              name: "Using Extensions",
            },
            {
              href: `${slug}/extensions/generate`,
              name: "Generating Extensions",
            },
            {
              href: `${slug}/extensions/create`,
              name: "Writing Extensions",
            },
            {
              href: `${slug}/extensions/built-in`,
              name: "Available Extensions",
            },
            {
              links: [
                {
                  href: `${slug}/extensions/examples/lens-protocol`,
                  name: "Lens Protocol",
                },
                {
                  href: `${slug}/extensions/examples/transfering-tokens`,
                  name: "Transfering tokens",
                },
                {
                  href: `${slug}/extensions/examples/ethereum-name-service`,
                  name: "Ethereum Name Service",
                },
              ],
              name: "Examples",
            },
          ],
          name: "Extensions",
        },
        {
          links:
            docs.functions
              ?.filter((f) => {
                const [tag, extensionName] = getCustomTag(f) || [];
                return tag === "@extension" && extensionName === "DEPLOY";
              })
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((f) => ({
                href: `${slug}/deploy/${f.name}`,
                name: f.name,
              })) || [],
          name: "Deploying contracts",
        },
        {
          links: [
            {
              href: `${slug}/modular`,
              name: "Introduction",
            },
            {
              href: `${slug}/modular/deploy`,
              name: "Deploying",
            },
            {
              href: `${slug}/modular/upgrade`,
              name: "Upgrading",
            },
            {
              href: `${slug}/modular/interact`,
              name: "Interacting",
            },
            {
              href: `${slug}/modular/built-in`,
              name: "Available Modules",
            },
          ],
          name: "Modular contracts",
        },
        {
          links:
            docs.functions
              ?.filter((f) => {
                const [tag] = getCustomTag(f) || [];
                return tag === "@rpc";
              })
              ?.map((f) => ({
                href: `${slug}/${f.name}`,
                name: f.name,
              })) || [],
          name: "RPC Methods",
        },
        {
          href: `${slug}/storage`,
          name: "IPFS Storage",
        },
        {
          links: [
            {
              links:
                docs.functions
                  ?.filter((f) => {
                    const [tag] = getCustomTag(f) || [];
                    if (tag !== "@bridge") return false;
                    const blockTag = f.signatures?.[0]?.blockTags?.find(
                      (b) => b.tag === "@bridge",
                    );
                    const extensionName = blockTag
                      ? getExtensionName(blockTag) || "Common"
                      : "Common";
                    if (extensionName !== "Buy") return false;
                    return true;
                  })
                  .map((f) => {
                    const blockTag = f.signatures?.[0]?.blockTags?.find(
                      (b) => b.tag === "@bridge",
                    );
                    const extensionName = blockTag
                      ? getExtensionName(blockTag) || "Common"
                      : "Common";
                    return {
                      href: `${slug}/${extensionName.toLowerCase()}/${f.name}`,
                      name: f.name,
                    };
                  }) || [],
              name: "Buy",
            },
            {
              links:
                docs.functions
                  ?.filter((f) => {
                    const [tag] = getCustomTag(f) || [];
                    if (tag !== "@bridge") return false;
                    const blockTag = f.signatures?.[0]?.blockTags?.find(
                      (b) => b.tag === "@bridge",
                    );
                    const extensionName = blockTag
                      ? getExtensionName(blockTag) || "Common"
                      : "Common";
                    if (extensionName !== "Sell") return false;
                    return true;
                  })
                  .map((f) => {
                    const blockTag = f.signatures?.[0]?.blockTags?.find(
                      (b) => b.tag === "@bridge",
                    );
                    const extensionName = blockTag
                      ? getExtensionName(blockTag) || "Common"
                      : "Common";
                    return {
                      href: `${slug}/${extensionName.toLowerCase()}/${f.name}`,
                      name: f.name,
                    };
                  }) || [],
              name: "Sell",
            },
            {
              links:
                docs.functions
                  ?.filter((f) => {
                    const [tag] = getCustomTag(f) || [];
                    if (tag !== "@bridge") return false;
                    const blockTag = f.signatures?.[0]?.blockTags?.find(
                      (b) => b.tag === "@bridge",
                    );
                    const extensionName = blockTag
                      ? getExtensionName(blockTag) || "Common"
                      : "Common";
                    if (extensionName !== "Onramp") return false;
                    return true;
                  })
                  .map((f) => {
                    const blockTag = f.signatures?.[0]?.blockTags?.find(
                      (b) => b.tag === "@bridge",
                    );
                    const extensionName = blockTag
                      ? getExtensionName(blockTag) || "Common"
                      : "Common";
                    return {
                      href: `${slug}/${extensionName.toLowerCase()}/${f.name}`,
                      name: f.name,
                    };
                  }) || [],
              name: "Onramp",
            },
            ...(docs.functions
              ?.filter((f) => {
                const [tag] = getCustomTag(f) || [];
                if (tag !== "@bridge") return false;
                const blockTag = f.signatures?.[0]?.blockTags?.find(
                  (b) => b.tag === "@bridge",
                );
                const extensionName = blockTag
                  ? getExtensionName(blockTag) || "Common"
                  : "Common";
                if (extensionName !== "Common") return false;
                return true;
              })
              ?.map((f) => {
                return {
                  href: `${slug}/${f.name}`,
                  name: f.name,
                };
              }) || []),
          ],
          name: "Bridge, Swap, and Onramp",
        },
      ],
      name: "Onchain Interactions",
    },
    { separator: true },
    {
      href: `${slug}/adapters`,
      name: "Usage with other libraries",
    },
    {
      href: `${slug}/migrate`,
      name: "Migrate from v4",
    },
  ],
  name: "Connect Typescript SDK",
};
