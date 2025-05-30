import type { SideBar } from "@/components/Layouts/DocLayout";
import type { SidebarLink } from "@/components/others/Sidebar";
import { CodeIcon, ExternalLinkIcon, ZapIcon } from "lucide-react";

const walletProviders: SidebarLink = (() => {
  const parentSlug = "/dotnet/wallets/providers";
  return {
    name: "Wallet Providers",
    links: [
      {
        name: "In App Wallet",
        href: `${parentSlug}/in-app-wallet`,
      },
      {
        name: "Ecosystem Wallet",
        href: `${parentSlug}/ecosystem-wallet`,
      },
      {
        name: "Account Abstraction",
        href: `${parentSlug}/account-abstraction`,
      },
      {
        name: "Private Key Wallet",
        href: `${parentSlug}/private-key`,
      },
      {
        name: "Engine Wallet",
        href: `${parentSlug}/engine-wallet`,
      },
    ],
  };
})();

const walletActions: SidebarLink = (() => {
  const parentSlug = "/dotnet/wallets/actions";
  return {
    name: "Wallet Actions",
    links: [
      {
        name: "IThirdwebWallet",
        isCollapsible: false,
        links: [
          {
            name: "GetAddress",
            href: `${parentSlug}/getaddress`,
          },
          {
            name: "IsConnected",
            href: `${parentSlug}/isconnected`,
          },
          {
            name: "Sign",
            href: `${parentSlug}/sign`,
          },
          {
            name: "SignTypedDataV4",
            href: `${parentSlug}/signtypeddatav4`,
          },
          {
            name: "Authenticate",
            href: `${parentSlug}/authenticate`,
          },
          {
            name: "Disconnect",
            href: `${parentSlug}/disconnect`,
          },
          {
            name: "SendTransaction",
            href: `${parentSlug}/sendtransaction`,
          },
          {
            name: "ExecuteTransaction",
            href: `${parentSlug}/executetransaction`,
          },
          {
            name: "Transfer",
            href: `${parentSlug}/transfer`,
          },
          {
            name: "SwitchNetwork",
            href: `${parentSlug}/switchnetwork`,
          },
          {
            name: "SignAuthorization",
            href: `${parentSlug}/signauthorization`,
          },
        ],
      },
      {
        name: "InAppWallet & EcosystemWallet",
        isCollapsible: false,
        links: [
          {
            name: "GetUserDetails",
            href: `${parentSlug}/getuserdetails`,
          },
          {
            name: "GetUserAuthDetails",
            href: `${parentSlug}/getuserauthdetails`,
          },
          {
            name: "GetEcosystemDetails",
            href: `${parentSlug}/getecosystemdetails`,
          },
          {
            name: "GenerateExternalLoginLink",
            href: `${parentSlug}/generateexternalloginlink`,
          },
        ],
      },
      {
        name: "SmartWallet",
        isCollapsible: false,
        links: [
          {
            name: "IsDeployed",
            href: `${parentSlug}/isdeployed`,
          },
          {
            name: "CreateSessionKey",
            href: `${parentSlug}/createsessionkey`,
          },
          {
            name: "AddAdmin",
            href: `${parentSlug}/addadmin`,
          },
          {
            name: "RemoveAdmin",
            href: `${parentSlug}/removeadmin`,
          },
          {
            name: "GetAllActiveSigners",
            href: `${parentSlug}/getallactivesigners`,
          },
          {
            name: "GetAllAdmins",
            href: `${parentSlug}/getalladmins`,
          },
          {
            name: "GetPersonalWallet",
            href: `${parentSlug}/getpersonalwallet`,
          },
          {
            name: "GetBalance",
            href: `${parentSlug}/getbalance`,
          },
          {
            name: "GetTransactionCount",
            href: `${parentSlug}/gettransactioncount`,
          },
        ],
      },
    ],
  };
})();

const contracts: SidebarLink = {
  name: "Contract Interactions",
  links: [
    {
      name: "Create Contract",
      href: "/dotnet/contracts/create",
    },
    {
      name: "Contract Extensions",
      href: "/dotnet/contracts/extensions",
    },
    {
      name: "Read Contract",
      href: "/dotnet/contracts/read",
    },
    {
      name: "Write Contract",
      href: "/dotnet/contracts/write",
    },
    {
      name: "Prepare Transaction",
      href: "/dotnet/contracts/prepare",
    },
  ],
};

const transactions: SidebarLink = {
  name: "Transaction Builder",
  links: [
    {
      name: "Create Transaction",
      href: "/dotnet/transactions/create",
    },
    {
      name: "Instance Methods",
      href: "/dotnet/transactions/instance",
    },
    {
      name: "Static Methods",
      href: "/dotnet/transactions/static",
    },
  ],
};

export const sidebar: SideBar = {
  name: ".NET SDK",
  links: [
    { separator: true },
    {
      name: "Overview",
      href: "/dotnet",
    },
    {
      name: "Getting Started",
      href: "/dotnet/getting-started",
      icon: <ZapIcon />,
    },
    {
      name: "API Reference",
      href: "https://thirdweb-dev.github.io/dotnet/index.html",
      isCollapsible: false,
      icon: <ExternalLinkIcon />,
    },
    {
      name: "Integrations",
      isCollapsible: true,
      icon: <CodeIcon />,
      links: [
        {
          name: "Unity",
          href: "/unity/v5",
        },
        {
          name: "Godot",
          href: "/dotnet/godot",
        },
        {
          name: "MAUI",
          href: "/dotnet/maui",
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "Core",
      isCollapsible: false,
      links: [
        {
          name: "Thirdweb Client",
          href: "/dotnet/client",
        },
        {
          name: "Storage",
          href: "/dotnet/storage",
        },
        {
          name: "Utilities",
          href: "/dotnet/utils",
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "Wallets",
      isCollapsible: false,
      links: [walletProviders, walletActions],
    },
    {
      separator: true,
    },
    {
      name: "Transactions",
      isCollapsible: false,
      links: [contracts, transactions],
    },
    {
      separator: true,
    },
    {
      name: "Bridge",
      isCollapsible: false,
      links: [
        {
          name: "Quickstart",
          href: "/dotnet/universal-bridge/quickstart",
        },
        {
          name: "Universal Bridge Full Reference",
          href: "https://thirdweb-dev.github.io/dotnet/docs/Thirdweb.Bridge.ThirdwebBridge.html",
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "Indexer",
      isCollapsible: false,
      links: [
        {
          name: "Quickstart",
          href: "/dotnet/insight/quickstart",
        },
        {
          name: "Insight Full Reference",
          href: "https://thirdweb-dev.github.io/dotnet/docs/Thirdweb.Indexer.ThirdwebInsight.html",
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "AI",
      isCollapsible: false,
      links: [
        {
          name: "Quickstart",
          href: "/dotnet/nebula/quickstart",
        },
        {
          name: "Nebula Full Reference",
          href: "https://thirdweb-dev.github.io/dotnet/docs/Thirdweb.AI.ThirdwebNebula.html",
        },
      ],
    },
    {
      separator: true,
    },
  ],
};
