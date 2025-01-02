import type { SideBar } from "@/components/Layouts/DocLayout";
import { InfraRPCIcon, InfraStorageIcon } from "@/icons";

const storageSlug = "/infrastructure/storage";
const rpcSlug = "/infrastructure/rpc-edge";

export const sidebar: SideBar = {
  name: "Infrastructure",
  links: [
    {
      name: "Overview",
      href: "/infrastructure",
    },
    // Storage
    { separator: true },
    {
      name: "Storage",
      icon: <InfraStorageIcon />,
      isCollapsible: false,
      links: [
        {
          name: "Overview",
          href: `${storageSlug}/overview`,
        },
        {
          name: "How Storage Works",
          href: `${storageSlug}/how-storage-works`,
        },
        {
          name: "How to Use Storage",
          links: [
            {
              name: "Connect SDK",
              href: "/connect",
            },
            {
              name: "Upload Files to IPFS",
              href: `${storageSlug}/how-to-use-storage/upload-files-to-ipfs`,
            },
            {
              name: "Host Web App",
              href: `${storageSlug}/how-to-use-storage/host-web-app`,
            },
          ],
        },
      ],
    },
    //RPC Edge
    { separator: true },
    {
      name: "RPC Edge",
      icon: <InfraRPCIcon />,
      isCollapsible: false,
      links: [
        {
          name: "Overview",
          href: `${rpcSlug}/overview`,
        },
        {
          name: "Get Started",
          href: `${rpcSlug}/get-started`,
        },
      ],
    },
  ],
};
