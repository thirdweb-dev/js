import { CodeIcon, ExternalLinkIcon, ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";
import type { SidebarLink } from "@/components/others/Sidebar";

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
  isCollapsible: false,
  links: [
    {
      href: "/dotnet/contracts/create",
      name: "Create Contract",
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
      href: "/dotnet/contracts/extensions",
      name: "Contract Extensions",
    },
  ],
  name: "Contracts",
};

const transactions: SidebarLink = {
  isCollapsible: false,
  links: [
    {
      href: "/dotnet/transactions/prepare",
      name: "Prepare Contract Transaction",
    },
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
  name: "Transactions",
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
          href: "/unity",
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
      links: [
        {
          href: `/dotnet/wallets/user-wallet`,
          name: "User Wallet",
        },
        {
          href: `/dotnet/wallets/server-wallet`,
          name: "Server Wallet",
        },
        {
          href: `/dotnet/wallets/account-abstraction`,
          name: "Account Abstraction",
        },
        walletActions,
      ],
      name: "Wallets",
    },
    {
      separator: true,
    },
    contracts,
    transactions,
    {
      isCollapsible: false,
      links: [
        {
          href: "/dotnet/api/quickstart",
          name: "Quickstart",
        },
        {
          href: "/reference",
          name: "API Full Reference",
        },
      ],
      name: "API",
    },
    {
      separator: true,
    },
  ],
  name: ".NET SDK",
};
