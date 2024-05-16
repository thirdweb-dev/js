import type { Chain } from "../src/types";
export default {
  "chain": "COTI",
  "chainId": 13068200,
  "explorers": [
    {
      "name": "coti devnet explorer",
      "url": "https://explorer-devnet.coti.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmVQidJf4ZXt6whYqZk9atCXLrmterkHrL4wYBCetZbsdj",
        "width": 200,
        "height": 200,
        "format": "png"
      }
    }
  ],
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
    "https://devnet.coti.io/rpc"
  ],
  "shortName": "coti-devnet",
  "slug": "coti-devnet",
  "testnet": false,
  "title": "COTI Devnet"
} as const satisfies Chain;