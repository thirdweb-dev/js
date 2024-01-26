import type { Chain } from "../src/types";
export default {
  "chain": "SPAY",
  "chainId": 742,
  "explorers": [
    {
      "name": "Script Explorer",
      "url": "https://explorer.script.tv",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://token.script.tv",
  "name": "Script Testnet",
  "nativeCurrency": {
    "name": "Script",
    "symbol": "SPAY",
    "decimals": 18
  },
  "networkId": 742,
  "rpc": [
    "https://script-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://742.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testeth-rpc-api.script.tv/rpc"
  ],
  "shortName": "SPAY",
  "slip44": 1,
  "slug": "script-testnet",
  "testnet": true
} as const satisfies Chain;