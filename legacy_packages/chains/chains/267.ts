import type { Chain } from "../src/types";
export default {
  "chain": "NEURA",
  "chainId": 267,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.neura-testnet.ankr.com",
      "standard": "EIP3091"
    },
    {
      "name": "ankrscan-neura",
      "url": "https://testnet.explorer.neuraprotocol.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://testnet.neuraprotocol.io/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.neuraprotocol.io/",
  "name": "Neura Testnet",
  "nativeCurrency": {
    "name": "Testnet Ankr",
    "symbol": "ANKR",
    "decimals": 18
  },
  "networkId": 267,
  "rpc": [
    "https://267.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ankr.com/neura_testnet"
  ],
  "shortName": "tneura",
  "slip44": 1,
  "slug": "neura-testnet",
  "status": "active",
  "testnet": true,
  "title": "Neura Testnet"
} as const satisfies Chain;