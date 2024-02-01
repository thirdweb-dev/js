import type { Chain } from "../src/types";
export default {
  "chain": "ALV",
  "chainId": 3797,
  "explorers": [
    {
      "name": "AlveyScan",
      "url": "https://alveyscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmTuY2Goyxpuy5GmA32EMYZBwxRcGsahiMFgfeBixSk7rb",
        "width": 2048,
        "height": 1538,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTuY2Goyxpuy5GmA32EMYZBwxRcGsahiMFgfeBixSk7rb",
    "width": 2048,
    "height": 1538,
    "format": "png"
  },
  "infoURL": "https://alveychain.com/",
  "name": "AlveyChain Mainnet",
  "nativeCurrency": {
    "name": "AlveyCoin",
    "symbol": "ALV",
    "decimals": 18
  },
  "networkId": 3797,
  "rpc": [
    "https://alveychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3797.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://elves-core1.alvey.io",
    "https://elves-core2.alvey.io",
    "https://elves-core3.alvey.io"
  ],
  "shortName": "alv",
  "slug": "alveychain",
  "testnet": false
} as const satisfies Chain;