import type { Chain } from "../src/types";
export default {
  "chain": "DOS",
  "chainId": 3939,
  "explorers": [
    {
      "name": "DOScan-Test",
      "url": "https://test.doscan.io",
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
  "infoURL": "http://doschain.io/",
  "name": "DOS Tesnet",
  "nativeCurrency": {
    "name": "DOS",
    "symbol": "DOS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dos-tesnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.doschain.com"
  ],
  "shortName": "dost",
  "slug": "dos-tesnet",
  "testnet": true
} as const satisfies Chain;