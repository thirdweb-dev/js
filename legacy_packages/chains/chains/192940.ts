import type { Chain } from "../src/types";
export default {
  "chain": "FHET",
  "chainId": 192940,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://mindnetwork.xyz",
  "name": "Mind Network Testnet",
  "nativeCurrency": {
    "name": "FHE",
    "symbol": "FHE",
    "decimals": 18
  },
  "networkId": 192940,
  "rpc": [
    "https://192940.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.mindnetwork.xyz",
    "wss://rpc-testnet.mindnetwork.xyz"
  ],
  "shortName": "fhet",
  "slug": "mind-network-testnet",
  "testnet": true
} as const satisfies Chain;