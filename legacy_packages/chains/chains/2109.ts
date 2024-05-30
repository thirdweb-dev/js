import type { Chain } from "../src/types";
export default {
  "chain": "EXN",
  "chainId": 2109,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.exosama.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://moonsama.com",
  "name": "Exosama Network",
  "nativeCurrency": {
    "name": "Sama Token",
    "symbol": "SAMA",
    "decimals": 18
  },
  "networkId": 2109,
  "rpc": [
    "https://2109.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.exosama.com",
    "wss://rpc.exosama.com"
  ],
  "shortName": "exn",
  "slip44": 2109,
  "slug": "exosama-network",
  "testnet": false
} as const satisfies Chain;