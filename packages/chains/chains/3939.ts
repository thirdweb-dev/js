import type { Chain } from "../src/types";
export default {
  "chainId": 3939,
  "chain": "DOS",
  "name": "DOS Tesnet",
  "rpc": [
    "https://dos-tesnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.doschain.com"
  ],
  "slug": "dos-tesnet",
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
  "infoURL": "http://doschain.io/",
  "shortName": "dost",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "DOScan-Test",
      "url": "https://test.doscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;