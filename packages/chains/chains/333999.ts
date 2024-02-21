import type { Chain } from "../src/types";
export default {
  "chain": "Olympus",
  "chainId": 333999,
  "explorers": [],
  "faucets": [
    "https://faucet.polis.tech"
  ],
  "icon": {
    "url": "ipfs://QmagWrtyApex28H2QeXcs3jJ2F7p2K7eESz3cDbHdQ3pjG",
    "width": 1050,
    "height": 1050,
    "format": "png"
  },
  "infoURL": "https://polis.tech",
  "name": "Polis Mainnet",
  "nativeCurrency": {
    "name": "Polis",
    "symbol": "POLIS",
    "decimals": 18
  },
  "networkId": 333999,
  "rpc": [
    "https://333999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.polis.tech"
  ],
  "shortName": "olympus",
  "slug": "polis",
  "testnet": false
} as const satisfies Chain;