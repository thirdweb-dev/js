import type { Chain } from "../src/types";
export default {
  "chain": "cyberdeck",
  "chainId": 1146703430,
  "explorers": [
    {
      "name": "CybEthExplorer",
      "url": "http://cybeth1.cyberdeck.eu:8000",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://cyberdeck.eu",
  "name": "CyberdeckNet",
  "nativeCurrency": {
    "name": "Cyb",
    "symbol": "CYB",
    "decimals": 18
  },
  "networkId": 1146703430,
  "rpc": [
    "https://1146703430.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://cybeth1.cyberdeck.eu:8545"
  ],
  "shortName": "cyb",
  "slug": "cyberdecknet",
  "status": "active",
  "testnet": false
} as const satisfies Chain;