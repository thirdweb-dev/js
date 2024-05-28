import type { Chain } from "../src/types";
export default {
  "chain": "LUKSO",
  "chainId": 42,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.execution.mainnet.lukso.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://lukso.network",
  "name": "LUKSO Mainnet",
  "nativeCurrency": {
    "name": "LUKSO",
    "symbol": "LYX",
    "decimals": 18
  },
  "networkId": 42,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://42.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.lukso.network",
    "wss://ws-rpc.mainnet.lukso.network"
  ],
  "shortName": "lukso",
  "slug": "lukso",
  "testnet": false
} as const satisfies Chain;