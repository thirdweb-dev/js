import type { Chain } from "../src/types";
export default {
  "chain": "CDT Blockchain",
  "chainId": 831,
  "explorers": [
    {
      "name": "CDT Explorer",
      "url": "https://explorer.checkdot.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://checkdot.io",
  "name": "CheckDot Blockchain Devnet",
  "nativeCurrency": {
    "name": "CDT",
    "symbol": "CDT",
    "decimals": 18
  },
  "networkId": 831,
  "rpc": [
    "https://checkdot-blockchain-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://831.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.checkdot.io"
  ],
  "shortName": "cdt",
  "slug": "checkdot-blockchain-devnet",
  "testnet": false
} as const satisfies Chain;