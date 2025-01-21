import type { SomeDoc } from "@/app/references/components/TDoc/types";
import type { BlockTag, TransformedDoc } from "typedoc-better-json";
import type {
  LinkGroup,
  SidebarLink,
} from "../../../../../components/others/Sidebar";
import { subgroups } from "./subgroups";
import { uniqueSlugger } from "./uniqueSlugger";

const tagsToGroup = {
  "@contract": "Contract",
  "@claimConditions": "Claim Conditions",
  "@nftDrop": "NFT Drop",
  "@platformFees": "Royalty & Fees",
  "@nft": "NFT",
  "@metadata": "Metadata",
  "@permissionControl": "Permissions Control",
  "@networkConnection": "Network Connection",
  "@delayedReveal": "Delayed Reveal",
  "@marketplace": "Marketplace",
  "@walletConnection": "Wallet Connection",
  "@walletUtils": "Wallet Utilities",
  "@token": "Tokens",
  "@auth": "Auth",
  "@smartWallet": "Smart Wallet",
  "@connectWallet": "Connect Wallet",
  "@appURI": "App URI",
  "@storage": "Storage",
  "@others": "Miscellaneous",
  "@wallet": "Wallets",
  "@walletConfig": "WalletConfig",
  "@theme": "Theme",
  "@locale": "Locale",
  "@abstractWallet": "Abstract Wallets",
  "@extension": "Extensions",
  "@rpc": "RPC",
  "@transaction": "Transactions",
  "@buyCrypto": "Buy Crypto",
  "@utils": "Utils",
  "@chain": "Chain",
  "@social": "Social API",
  "@modules": "Modules",
  "@client": "Client",
  "@account": "Account",
  "@nebula": "Nebula",
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
  "@nebula",
  "@social",
  "@auth",
  "@nft",
  "@buyCrypto",
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
            name: d.name,
            href: getLink(`${path}/${extensionName.toLowerCase()}/${d.name}`),
          }));
          return {
            name: extensionName,
            links,
          };
        },
      );
      if (!linkGroups.find((group) => group.name === name)) {
        linkGroups.push({
          name: name,
          href: getLink(`${path}/${key}`),
          links: [{ name: "Extensions", links: extensionLinkGroups }],
          isCollapsible: false,
        });
      } else {
        linkGroups
          .find((group) => group.name === name)
          ?.links.push({ name: "Extensions", links: extensionLinkGroups });
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
            name: d.name,
            href: getLink(`${path}/${extensionName.toLowerCase()}/${d.name}`),
          }));
          return {
            name: extensionName,
            links,
          };
        },
      );
      if (!linkGroups.find((group) => group.name === name)) {
        linkGroups.push({
          name: name,
          href: getLink(`${path}/${key}`),
          links: [{ name: "modules", links: extensionLinkGroups }],
        });
      } else {
        linkGroups
          .find((group) => group.name === name)
          ?.links.push({ name: "Modules", links: extensionLinkGroups });
      }
    }

    const nonExtensions = docs.filter((d) => {
      const [tag] = getCustomTag(d) || [];
      return tag !== "@extension" && tag !== "@modules";
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
        name: tagsToGroup[tag],
        links: groupDocs.map((d) => ({
          name: d.name,
          href: getLink(`${path}/${d.name}`),
        })),
      });
    };

    for (const tag of sidebarGroupOrder) {
      addGroup(tag);
    }

    for (const d of ungroupedLinks) {
      links.push({
        name: d.name,
        href: getLink(`${path}/${d.name}`),
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
        name: name,
        links: links,
        href: getLink(`${path}/${key}`),
        isCollapsible: false,
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
    const extensionNameString =
      extensionBlockTag?.summary?.[0]?.children?.[0]?.value || "Common";

    if (typeof extensionNameString === "string" && extensionNameString) {
      return extensionNameString;
    }
  } catch {
    return undefined;
  }
}
