import "server-only";
import type { InAppWalletAuth } from "thirdweb/wallets";
import type { Permission } from "../../components/permission-card";

export async function getLoginConfig(clientId: string): Promise<LoginConfig> {
  if (clientId === "demo") {
    return DEMO_ENVIRONMENT;
  }
  // temporary manual config
  if (clientId === "b24106adfb2ec212e6ec4d3b2e04db9e") {
    return {
      ...DEFAULT_CONFIG,
      sessionKeySignerAddress: "0xb89e32a18350d6df5bf0b89a227E098013C4Fa72",
    };
  }
  // TODO: implement fetch for config from API server
  return DEFAULT_CONFIG;
}

export type LoginConfig = {
  id: string;
  name: string;
  logo: string;
  logoLink: string;
  chainId: number;
  authOptions: Exclude<InAppWalletAuth, "backend">[];
  permissions: Permission[];
  sessionKeySignerAddress: string;
};

const DEMO_ENVIRONMENT: LoginConfig = {
  id: "demo_app",
  name: "thirdweb demo app",
  logo: "https://thirdweb.com/brand/thirdweb-icon.svg",
  logoLink: "https://thirdweb.com",
  chainId: 84532,
  sessionKeySignerAddress: "0x6f700ba0258886411D2536399624EAa7158d1742",
  authOptions: [
    "google",
    "apple",
    "facebook",
    "discord",
    "line",
    "x",
    "coinbase",
    "farcaster",
    "telegram",
    "github",
    "twitch",
    "steam",
    "guest",
    "email",
    "phone",
    "passkey",
    "wallet",
  ],
  permissions: [
    {
      id: "identity:read",
      type: "toggle",
      name: "User Identity",
      description: "Access to read your identity information.",
      mandatory: true,
      initialState: true,
    },
    {
      id: "contracts:write",
      type: "toggle",
      name: "All Contracts",
      description: "Access to write to all smart contracts on your behalf.",
      mandatory: true,
      initialState: true,
    },
    {
      id: "native:spend",
      type: "number",
      name: "Native Spend Limit",
      description:
        "Set the maximum amount of native currency you can spend on your behalf.",
      mandatory: false,
      initialState: 5,
      min: 0,
      step: 0.1,
    },
    {
      id: "expiration",
      type: "date",
      name: "Expiration",
      description: "The expiration date of these permissions.",
      mandatory: false,
      initialState: addToDate(new Date(), 30),
    },
  ],
};

const DEFAULT_CONFIG: LoginConfig = {
  id: "default",
  name: "thirdweb",
  logo: "https://thirdweb.com/brand/thirdweb-icon.svg",
  logoLink: "https://thirdweb.com",
  chainId: 84532,
  sessionKeySignerAddress: "0x6f700ba0258886411D2536399624EAa7158d1742",
  authOptions: [
    "google",
    "apple",
    "facebook",
    "x",
    "email",
    "phone",
    "passkey",
    "wallet",
    "guest",
  ],
  permissions: [
    {
      id: "identity:read",
      type: "toggle",
      name: "User Identity",
      description: "Access to read your identity information.",
      mandatory: true,
      initialState: true,
    },
    {
      id: "contracts:write",
      type: "toggle",
      name: "Interact with Contracts",
      description: "Access to write to all smart contracts on your behalf.",
      mandatory: true,
      initialState: true,
    },
  ],
};

function addToDate(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
