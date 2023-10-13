import type { Chain } from "../src/types";
export default {
  "chain": "DOS",
  "chainId": 7979,
  "explorers": [
    {
      "name": "DOScan",
      "url": "https://doscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmV2Nowzo81F6pi2qFcHePA4MwmmdMKBMUzBJUrxcymxx4",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://doschain.io",
  "name": "DOS Chain",
  "nativeCurrency": {
    "name": "DOS",
    "symbol": "DOS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dos-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://main.doschain.com"
  ],
  "shortName": "dos",
  "slug": "dos-chain",
  "testnet": false
} as const satisfies Chain;