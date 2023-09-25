import type { Chain } from "../src/types";
export default {
  "chainId": 333999,
  "chain": "Olympus",
  "name": "Polis Mainnet",
  "rpc": [
    "https://polis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.polis.tech"
  ],
  "slug": "polis",
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
    "name": "Polis",
    "symbol": "POLIS",
    "decimals": 18
  },
  "infoURL": "https://polis.tech",
  "shortName": "olympus",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;