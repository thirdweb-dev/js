import type { Chain } from "../src/types";
export default {
  "chainId": 7979,
  "chain": "DOS",
  "name": "DOS Chain",
  "rpc": [
    "https://dos-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://main.doschain.com"
  ],
  "slug": "dos-chain",
  "icon": {
    "url": "ipfs://QmV2Nowzo81F6pi2qFcHePA4MwmmdMKBMUzBJUrxcymxx4",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "DOS",
    "symbol": "DOS",
    "decimals": 18
  },
  "infoURL": "https://doschain.io",
  "shortName": "dos",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "DOScan",
      "url": "https://doscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;