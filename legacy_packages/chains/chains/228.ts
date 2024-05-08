import type { Chain } from "../src/types";
export default {
  "chain": "FHE",
  "chainId": 228,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://mindnetwork.xyz",
  "name": "Mind Network Mainnet",
  "nativeCurrency": {
    "name": "FHE",
    "symbol": "FHE",
    "decimals": 18
  },
  "networkId": 228,
  "rpc": [
    "https://228.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc_mainnet.mindnetwork.xyz",
    "wss://rpc_mainnet.mindnetwork.xyz"
  ],
  "shortName": "fhe",
  "slug": "mind-network",
  "testnet": false
} as const satisfies Chain;