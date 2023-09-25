import type { Chain } from "../src/types";
export default {
  "chainId": 333888,
  "chain": "Sparta",
  "name": "Polis Testnet",
  "rpc": [
    "https://polis-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sparta-rpc.polis.tech"
  ],
  "slug": "polis-testnet",
  "icon": {
    "url": "ipfs://QmagWrtyApex28H2QeXcs3jJ2F7p2K7eESz3cDbHdQ3pjG",
    "width": 1050,
    "height": 1050,
    "format": "png"
  },
  "faucets": [
    "https://faucet.polis.tech"
  ],
  "nativeCurrency": {
    "name": "tPolis",
    "symbol": "tPOLIS",
    "decimals": 18
  },
  "infoURL": "https://polis.tech",
  "shortName": "sparta",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;