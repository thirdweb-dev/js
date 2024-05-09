import type { Chain } from "../src/types";
export default {
  "chain": "COTI",
  "chainId": 13068200,
  "explorers": [],
  "faucets": [
    "https://faucet.coti.io"
  ],
  "icon": {
    "url": "ipfs://QmR58SroHx7ovpqEB5iRkw4PufEXmcCBAJ8AZ7mChDgTfV",
    "width": 528,
    "height": 528,
    "format": "png"
  },
  "infoURL": "https://coti.io/",
  "name": "COTI Devnet",
  "nativeCurrency": {
    "name": "COTI2",
    "symbol": "COTI2",
    "decimals": 18
  },
  "networkId": 13068200,
  "rpc": [
    "https://13068200.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.coti.io"
  ],
  "shortName": "coti-devnet",
  "slug": "coti-devnet",
  "testnet": false,
  "title": "COTI Devnet"
} as const satisfies Chain;