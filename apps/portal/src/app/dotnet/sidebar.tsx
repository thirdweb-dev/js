import { CodeIcon, ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";
import type { SidebarLink } from "@/components/others/Sidebar";

const walletProviders: SidebarLink = (() => {
  const parentSlug = "/dotnet/wallets/providers";
  return {
    links: [
      {
        href: `${parentSlug}/in-app-wallet`,
        name: "In App Wallet",
      },
      {
        href: `${parentSlug}/ecosystem-wallet`,
        name: "Ecosystem Wallet",
      },
      {
        href: `${parentSlug}/account-abstraction`,
        name: "Account Abstraction",
      },
      {
        href: `${parentSlug}/private-key`,
        name: "Private Key Wallet",
      },
      {
        href: `${parentSlug}/transactions-wallet`,
        name: "Engine Wallet",
      },
    ],
    name: "Wallet Providers",
  };
})();

const walletActions: SidebarLink = (() => {
  const parentSlug = "/dotnet/wallets/actions";
  return {
    links: [
      {
        isCollapsible: false,
        links: [
          {
            href: `${parentSlug}/getaddress`,
            name: "GetAddress",
          },
          {
            href: `${parentSlug}/isconnected`,
            name: "IsConnected",
          },
          {
            href: `${parentSlug}/sign`,
            name: "Sign",
          },
          {
            href: `${parentSlug}/signtypeddatav4`,
            name: "SignTypedDataV4",
          },
          {
            href: `${parentSlug}/authenticate`,
            name: "Authenticate",
          },
          {
            href: `${parentSlug}/disconnect`,
            name: "Disconnect",
          },
          {
            href: `${parentSlug}/sendtransaction`,
            name: "SendTransaction",
          },
          {
            href: `${parentSlug}/executetransaction`,
            name: "ExecuteTransaction",
          },
          {
            href: `${parentSlug}/transfer`,
            name: "Transfer",
          },
          {
            href: `${parentSlug}/switchnetwork`,
            name: "SwitchNetwork",
          },
          {
            href: `${parentSlug}/signauthorization`,
            name: "SignAuthorization",
          },
        ],
        name: "IThirdwebWallet",
      },
      {
        isCollapsible: false,
        links: [
          {
            href: `${parentSlug}/getuserdetails`,
            name: "GetUserDetails",
          },
          {
            href: `${parentSlug}/getuserauthdetails`,
            name: "GetUserAuthDetails",
          },
          {
            href: `${parentSlug}/getecosystemdetails`,
            name: "GetEcosystemDetails",
          },
          {
            href: `${parentSlug}/generateexternalloginlink`,
            name: "GenerateExternalLoginLink",
          },
          {
            href: `${parentSlug}/createsessionkey7702`,
            name: "CreateSessionKey (EIP-7702)",
          },
          {
            href: `${parentSlug}/signerhaspermissions7702`,
            name: "SignerHasFullPermissions",
          },
          {
            href: `${parentSlug}/getcallpolicies7702`,
            name: "GetCallPoliciesForSigner",
          },
          {
            href: `${parentSlug}/gettransferpolicies7702`,
            name: "GetTransferPoliciesForSigner",
          },
          {
            href: `${parentSlug}/getsessionexpiration7702`,
            name: "GetSessionExpirationForSigner",
          },
          {
            href: `${parentSlug}/getsessionstate7702`,
            name: "GetSessionStateForSigner",
          },
        ],
        name: "InAppWallet & EcosystemWallet",
      },
      {
        isCollapsible: false,
        links: [
          {
            href: `${parentSlug}/isdeployed`,
            name: "IsDeployed",
          },
          {
            href: `${parentSlug}/createsessionkey`,
            name: "CreateSessionKey (EIP-4337)",
          },
          {
            href: `${parentSlug}/addadmin`,
            name: "AddAdmin",
          },
          {
            href: `${parentSlug}/removeadmin`,
            name: "RemoveAdmin",
          },
          {
            href: `${parentSlug}/getallactivesigners`,
            name: "GetAllActiveSigners",
          },
          {
            href: `${parentSlug}/getalladmins`,
            name: "GetAllAdmins",
          },
          {
            href: `${parentSlug}/getpersonalwallet`,
            name: "GetPersonalWallet",
          },
          {
            href: `${parentSlug}/getbalance`,
            name: "GetBalance",
          },
          {
            href: `${parentSlug}/gettransactioncount`,
            name: "GetTransactionCount",
          },
        ],
        name: "SmartWallet",
      },
    ],
    name: "Wallet Actions",
  };
})();

const contracts: SidebarLink = {
  links: [
    {
      href: "/dotnet/contracts/create",
      name: "Create Contract",
    },
    {
      href: "/dotnet/contracts/extensions",
      name: "Contract Extensions",
    },
    {
      href: "/dotnet/contracts/read",
      name: "Read Contract",
    },
    {
      href: "/dotnet/contracts/write",
      name: "Write Contract",
    },
    {
      href: "/dotnet/contracts/prepare",
      name: "Prepare Transaction",
    },
  ],
  name: "Contract Interactions",
};

const transactions: SidebarLink = {
  links: [
    {
      href: "/dotnet/transactions/create",
      name: "Create Transaction",
    },
    {
      href: "/dotnet/transactions/instance",
      name: "Instance Methods",
    },
    {
      href: "/dotnet/transactions/static",
      name: "Static Methods",
    },
  ],
  name: "Transaction Builder",
};

export const sidebar: SideBar = {
  links: [
    { separator: true },
    {
      href: "/dotnet",
      name: "Overview",
    },
    {
      href: "/dotnet/getting-started",
      icon: <ZapIcon />,
      name: "Getting Started",
    },
    {
      href: "https://thirdweb-dev.github.io/dotnet/index.html",
      icon: <ExternalLinkIcon />,
      isCollapsible: false,
      name: "API Reference",
    },
    {
      icon: <CodeIcon />,
      isCollapsible: true,
      links: [
        {
          href: "/unity/v5",
          name: "Unity",
        },
        {
          href: "/dotnet/godot",
          name: "Godot",
        },
        {
          href: "/dotnet/maui",
          name: "MAUI",
        },
      ],
      name: "Integrations",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [
        {
          href: "/dotnet/client",
          name: "Thirdweb Client",
        },
        {
          href: "/dotnet/storage",
          name: "Storage",
        },
        {
          href: "/dotnet/utils",
          name: "Utilities",
        },
      ],
      name: "Core",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [walletProviders, walletActions],
      name: "Wallets",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [contracts, transactions],
      name: "Transactions",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [
        {
          href: "/dotnet/universal-bridge/quickstart",
          name: "Quickstart",
        },
        {
          href: "https://thirdweb-dev.github.io/dotnet/docs/Thirdweb.Bridge.ThirdwebBridge.html",
          name: "Universal Bridge Full Reference",
        },
      ],
      name: "Bridge",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [
        {
          href: "/dotnet/insight/quickstart",
          name: "Quickstart",
        },
        {
          href: "https://thirdweb-dev.github.io/dotnet/docs/Thirdweb.Indexer.ThirdwebInsight.html",
          name: "Insight Full Reference",
        },
      ],
      name: "Indexer",
    },
    {
      separator: true,
    },
    {
      isCollapsible: false,
      links: [
        {
          href: "/dotnet/nebula/quickstart",
          name: "Quickstart",
        },
        {
          href: "https://thirdweb-dev.github.io/dotnet/docs/Thirdweb.AI.ThirdwebNebula.html",
          name: "Nebula Full Reference",
        },
      ],
      name: "AI",
    },
    {
      separator: true,
    },
  ],
  name: ".NET SDK",
};
