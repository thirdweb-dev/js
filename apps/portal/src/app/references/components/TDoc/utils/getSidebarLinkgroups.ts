import type { BlockTag, TransformedDoc } from "typedoc-better-json";
import type { SomeDoc } from "@/app/references/components/TDoc/types";
import type {
  LinkGroup,
  SidebarLink,
} from "../../../../../components/others/Sidebar";
import { subgroups } from "./subgroups";
import { uniqueSlugger } from "./uniqueSlugger";

const tagsToGroup = {
  "@abstractWallet": "Abstract Wallets",
  "@account": "Account",
  "@appURI": "App URI",
  "@auth": "Auth",
  "@bridge": "Payments",
  "@x402": "x402",
  "@chain": "Chain",
  "@claimConditions": "Claim Conditions",
  "@client": "Client",
  "@connectWallet": "Connect Wallet",
  "@contract": "Contract",
  "@delayedReveal": "Delayed Reveal",
  "@engine": "Engine",
  "@extension": "Extensions",
  "@insight": "Insight",
  "@locale": "Locale",
  "@marketplace": "Marketplace",
  "@metadata": "Metadata",
  "@modules": "Modules",
  "@nebula": "Nebula",
  "@networkConnection": "Network Connection",
  "@nft": "NFT",
  "@nftDrop": "NFT Drop",
  "@others": "Miscellaneous",
  "@permissionControl": "Permissions Control",
  "@platformFees": "Royalty & Fees",
  "@rpc": "RPC",
  "@smartWallet": "Smart Wallet",
  "@social": "Social API",
  "@storage": "Storage",
  "@theme": "Theme",
  "@token": "Tokens",
  "@transaction": "Transactions",
  "@utils": "Utils",
  "@wallet": "Wallets",
  "@walletConfig": "WalletConfig",
  "@walletConnection": "Wallet Connection",
  "@walletUtils": "Wallet Utilities",
} as const;

type TagKey = keyof typeof tagsToGroup;

const sidebarGroupOrder: TagKey[] = [
  "@client",
  "@wallet",
  "@abstractWallet",
  "@locale",
  "@networkConnection",
  "@walletConfig",
  "@walletConnection",
  "@walletUtils",
  "@chain",
  "@account",
  "@contract",
  "@transaction",
  "@insight",
  "@engine",
  "@x402",
  "@bridge",
  "@nebula",
  "@social",
  "@auth",
  "@nft",
  "@nftDrop",
  "@claimConditions",
  "@delayedReveal",
  "@token",
  "@marketplace",
  "@metadata",
  "@permissionControl",
  "@platformFees",
  "@storage",
  "@smartWallet",
  "@connectWallet",
  "@appURI",
  "@extension",
  "@rpc",
  "@modules",
  "@theme",
  "@utils",
  "@others",
];

function findTag(
  blockTags?: BlockTag[],
): [TagKey, string | undefined] | undefined {
  if (!blockTags) {
    return;
  }

  for (const blockTag of blockTags) {
    if (blockTag.tag in tagsToGroup) {
      return [blockTag.tag as TagKey, getExtensionName(blockTag)];
    }
  }
}

export function getCustomTag(
  doc: SomeDoc,
): [TagKey, string | undefined] | undefined {
  switch (doc.kind) {
    case "class": {
      return findTag(doc.blockTags);
    }
    case "function": {
      if (doc.signatures?.[0]?.blockTags) {
        return findTag(doc.signatures?.[0].blockTags);
      }
      return undefined;
    }

    case "variable": {
      return findTag(doc.blockTags);
    }

    case "enum": {
      return findTag(doc.blockTags);
    }

    case "accessor": {
      return findTag(doc.blockTags);
    }

    case "type": {
      return findTag(doc.blockTags);
    }
  }
}

export function getSidebarLinkGroups(doc: TransformedDoc, path: string) {
  const linkGroups: LinkGroup[] = [];
  const generatedLinks = new Set<string>();

  const getLink = (href: string) => {
    const link = uniqueSlugger({
      base: href,
      isUnique: (s) => !generatedLinks.has(s),
    });

    generatedLinks.add(link);
    return link;
  };

  // group links by tags
  function createSubGroups(key: keyof typeof subgroups, docs: SomeDoc[]) {
    const name = subgroups[key];

    const groups: {
      [K in TagKey]?: SomeDoc[];
    } = {};

    const ungroupedLinks: SomeDoc[] = [];

    const extensions = docs.filter((d) => {
      const [tag] = getCustomTag(d) || [];
      return tag === "@extension";
    });

    const modules = docs.filter((d) => {
      const [tag] = getCustomTag(d) || [];
      return tag === "@modules";
    });

    const bridge = docs.filter((d) => {
      const [tag] = getCustomTag(d) || [];
      return tag === "@bridge";
    });

    // sort extensions into their own groups
    if (extensions.length) {
      const extensionGroups = extensions.reduce(
        (acc, d) => {
          const [, extensionName] = getCustomTag(d) || [];
          if (extensionName) {
            if (!acc[extensionName]) {
              acc[extensionName] = [];
            }
            acc[extensionName]?.push(d);
          }
          return acc;
        },
        {} as Record<string, SomeDoc[]>,
      );
      const extensionLinkGroups = Object.entries(extensionGroups).map(
        ([extensionName, docs]) => {
          const links = docs.map((d) => ({
            href: getLink(`${path}/${extensionName.toLowerCase()}/${d.name}`),
            name: d.name,
          }));
          return {
            links,
            name: extensionName,
          };
        },
      );
      if (!linkGroups.find((group) => group.name === name)) {
        linkGroups.push({
          href: getLink(`${path}/${key}`),
          isCollapsible: false,
          links: [{ links: extensionLinkGroups, name: "Extensions" }],
          name: name,
        });
      } else {
        linkGroups
          .find((group) => group.name === name)
          ?.links.push({ links: extensionLinkGroups, name: "Extensions" });
      }
    }

    if (modules.length) {
      const extensionGroups = modules.reduce(
        (acc, d) => {
          const [, extensionName] = getCustomTag(d) || [];
          if (extensionName) {
            if (!acc[extensionName]) {
              acc[extensionName] = [];
            }
            acc[extensionName]?.push(d);
          }
          return acc;
        },
        {} as Record<string, SomeDoc[]>,
      );
      const extensionLinkGroups = Object.entries(extensionGroups).map(
        ([extensionName, docs]) => {
          const links = docs.map((d) => ({
            href: getLink(`${path}/${extensionName.toLowerCase()}/${d.name}`),
            name: d.name,
          }));
          return {
            links,
            name: extensionName,
          };
        },
      );
      if (!linkGroups.find((group) => group.name === name)) {
        linkGroups.push({
          href: getLink(`${path}/${key}`),
          links: [{ links: extensionLinkGroups, name: "modules" }],
          name: name,
        });
      } else {
        linkGroups
          .find((group) => group.name === name)
          ?.links.push({ links: extensionLinkGroups, name: "Modules" });
      }
    }

    if (bridge.length) {
      const bridgeGroups = bridge.reduce(
        (acc, d) => {
          const [, moduleName] = getCustomTag(d) || [];
          if (!acc[moduleName ?? "common"]) {
            acc[moduleName ?? "common"] = [];
          }
          acc[moduleName ?? "common"]?.push(d);
          return acc;
        },
        {} as Record<string, SomeDoc[]>,
      );
      const bridgeLinkGroups: {
        name: string;
        href: string;
        links?: { name: string; href?: string }[];
      }[] = Object.entries(bridgeGroups)
        .filter(([namespaceName]) => namespaceName.toLowerCase() !== "common")
        .map(([namespaceName, docs]) => {
          const links = docs.map((d) => ({
            href: getLink(`${path}/${namespaceName.toLowerCase()}/${d.name}`),
            name: d.name,
          }));
          return {
            href: "",
            links,
            name: namespaceName,
          };
        });

      // Add the top-level functions
      for (const group of Object.entries(bridgeGroups).filter(
        ([namespaceName]) => namespaceName.toLowerCase() === "common",
      )) {
        const docs = group[1];
        for (const doc of docs) {
          bridgeLinkGroups.push({
            href: getLink(`${path}/${doc.name}`),
            name: doc.name,
          });
        }
      }

      if (!linkGroups.find((group) => group.name === name)) {
        linkGroups.push({
          href: getLink(`${path}/${key}`),
          isCollapsible: false,
          links: [{ links: bridgeLinkGroups, name: "Payments" }],
          name: name,
        });
      } else {
        linkGroups
          .find((group) => group.name === name)
          ?.links.push({ links: bridgeLinkGroups, name: "Payments" });
      }
    }

    const nonExtensions = docs.filter((d) => {
      const [tag] = getCustomTag(d) || [];
      return tag !== "@extension" && tag !== "@modules" && tag !== "@bridge";
    });

    // sort into groups
    for (const d of nonExtensions) {
      let [tag] = getCustomTag(d) || [];
      // for ungrouped functions - put it in utils
      // useful for re-exports that we can't tag
      if (!tag) {
        tag = "@others";
      }

      if (tag) {
        if (!groups[tag]) {
          groups[tag] = [];
        }
        groups[tag]?.push(d);
      } else {
        ungroupedLinks.push(d);
      }
    }

    // throw error if we don't know where to put the group in sidebar ( because this leads to it not being added in sidebar at all )
    for (const tag of Object.keys(groups)) {
      if (!sidebarGroupOrder.includes(tag as TagKey)) {
        throw new Error(`${tag} not added in sidebarGroupOrder array`);
      }
    }

    const links: SidebarLink[] = [];

    const addGroup = (tag: TagKey) => {
      const groupDocs = groups[tag];
      if (!groupDocs) {
        return;
      }

      links.push({
        links: groupDocs.map((d) => ({
          href: getLink(`${path}/${d.name}`),
          name: d.name,
        })),
        name: tagsToGroup[tag],
      });
    };

    for (const tag of sidebarGroupOrder) {
      addGroup(tag);
    }

    for (const d of ungroupedLinks) {
      links.push({
        href: getLink(`${path}/${d.name}`),
        name: d.name,
      });
    }

    const target = linkGroups.find((group) => group.name === name);

    // push links to existing group
    if (target) {
      target.links.push(...links);
    }
    // create new group
    else {
      linkGroups.push({
        href: getLink(`${path}/${key}`),
        isCollapsible: false,
        links: links,
        name: name,
      });
    }
  }

  if (doc.components) {
    createSubGroups("components", doc.components);
  }

  if (doc.hooks) {
    createSubGroups("hooks", doc.hooks);
  }

  if (doc.functions) {
    createSubGroups("functions", doc.functions);
  }

  return linkGroups;
}

export function getExtensionName(
  extensionBlockTag: BlockTag,
): string | undefined {
  try {
    const summary = extensionBlockTag.summary?.[0];
    if (summary && "children" in summary) {
      const firstChild = summary.children[0];
      if (firstChild && "value" in firstChild) {
        const extensionNameString = firstChild.value || "Common";
        if (typeof extensionNameString === "string" && extensionNameString) {
          return extensionNameString;
        }
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}
