import type { Chain } from "../src/types";
export default {
  "chainId": 742,
  "chain": "SPAY",
  "name": "Script Testnet",
  "rpc": [
    "https://script-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testeth-rpc-api.script.tv/rpc"
  ],
  "slug": "script-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Script",
    "symbol": "SPAY",
    "decimals": 18
  },
  "infoURL": "https://token.script.tv",
  "shortName": "SPAY",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Script Explorer",
      "url": "https://explorer.script.tv",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;