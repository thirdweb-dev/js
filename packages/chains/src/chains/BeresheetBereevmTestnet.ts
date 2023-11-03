import type { Chain } from "../types";
export default {
  "chain": "EDG",
  "chainId": 2022,
  "explorers": [
    {
      "name": "Edgscan by Bharathcoorg",
      "url": "https://testnet.edgscan.live",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://edgeware.io/build",
  "name": "Beresheet BereEVM Testnet",
  "nativeCurrency": {
    "name": "Testnet EDG",
    "symbol": "tEDG",
    "decimals": 18
  },
  "networkId": 2022,
  "rpc": [
    "https://beresheet-bereevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2022.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beresheet-evm.jelliedowl.net",
    "wss://beresheet.jelliedowl.net"
  ],
  "shortName": "edgt",
  "slug": "beresheet-bereevm-testnet",
  "testnet": true
} as const satisfies Chain;