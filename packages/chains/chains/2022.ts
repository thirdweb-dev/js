import type { Chain } from "../src/types";
export default {
  "chainId": 2022,
  "chain": "EDG",
  "name": "Beresheet BereEVM Testnet",
  "rpc": [
    "https://beresheet-bereevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beresheet-evm.jelliedowl.net",
    "wss://beresheet.jelliedowl.net"
  ],
  "slug": "beresheet-bereevm-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Testnet EDG",
    "symbol": "tEDG",
    "decimals": 18
  },
  "infoURL": "https://edgeware.io/build",
  "shortName": "edgt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Edgscan by Bharathcoorg",
      "url": "https://testnet.edgscan.live",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;