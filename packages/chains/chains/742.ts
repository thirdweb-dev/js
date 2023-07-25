import type { Chain } from "../src/types";
export default {
  "name": "Script Testnet",
  "chain": "SPAY",
  "rpc": [
    "https://script-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testeth-rpc-api.script.tv/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Script",
    "symbol": "SPAY",
    "decimals": 18
  },
  "infoURL": "https://token.script.tv",
  "shortName": "SPAY",
  "chainId": 742,
  "networkId": 742,
  "explorers": [
    {
      "name": "Script Explorer",
      "url": "https://explorer.script.tv",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "script-testnet"
} as const satisfies Chain;