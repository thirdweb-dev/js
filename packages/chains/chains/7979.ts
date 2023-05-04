import type { Chain } from "../src/types";
export default {
  "name": "DOS Chain",
  "chain": "DOS",
  "rpc": [
    "https://dos-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://main.doschain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DOS",
    "symbol": "DOS",
    "decimals": 18
  },
  "infoURL": "https://doschain.io",
  "shortName": "dos",
  "chainId": 7979,
  "networkId": 7979,
  "icon": {
    "url": "ipfs://QmV2Nowzo81F6pi2qFcHePA4MwmmdMKBMUzBJUrxcymxx4",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "DOScan",
      "url": "https://doscan.io",
      "icon": {
        "url": "ipfs://QmV2Nowzo81F6pi2qFcHePA4MwmmdMKBMUzBJUrxcymxx4",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "dos-chain"
} as const satisfies Chain;