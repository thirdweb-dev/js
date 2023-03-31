import type { Chain } from "../src/types";
export default {
  "name": "Beresheet BereEVM Testnet",
  "chain": "EDG",
  "rpc": [
    "https://beresheet-bereevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beresheet-evm.jelliedowl.net",
    "wss://beresheet.jelliedowl.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Testnet EDG",
    "symbol": "tEDG",
    "decimals": 18
  },
  "infoURL": "https://edgeware.io/build",
  "shortName": "edgt",
  "chainId": 2022,
  "networkId": 2022,
  "explorers": [
    {
      "name": "Edgscan by Bharathcoorg",
      "url": "https://testnet.edgscan.live",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "beresheet-bereevm-testnet"
} as const satisfies Chain;