import type { SideBar } from "@/components/Layouts/DocLayout";
import { InfraRPCIcon, InfraStorageIcon } from "@/icons";

const storageSlug = "/infrastructure/storage";
const rpcSlug = "/infrastructure/rpc-edge";

export const sidebar: SideBar = {
  links: [
    {
      href: "/infrastructure",
      name: "Overview",
    },
    // Storage
    { separator: true },
    {
      icon: <InfraStorageIcon />,
      isCollapsible: false,
      links: [
        {
          href: `${storageSlug}/overview`,
          name: "Overview",
        },
        {
          href: `${storageSlug}/how-storage-works`,
          name: "How Storage Works",
        },
        {
          links: [
            {
              href: "/connect",
              name: "Connect SDK",
            },
            {
              href: `${storageSlug}/how-to-use-storage/upload-files-to-ipfs`,
              name: "Upload Files to IPFS",
            },
            {
              href: `${storageSlug}/how-to-use-storage/host-web-app`,
              name: "Host Web App",
            },
          ],
          name: "How to Use Storage",
        },
      ],
      name: "Storage",
    },
    //RPC Edge
    { separator: true },
    {
      icon: <InfraRPCIcon />,
      isCollapsible: false,
      links: [
        {
          href: `${rpcSlug}/overview`,
          name: "Overview",
        },
        {
          href: `${rpcSlug}/get-started`,
          name: "Get Started",
        },
      ],
      name: "RPC Edge",
    },
  ],
  name: "Infrastructure",
};
