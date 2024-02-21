import type { Chain } from "../src/types";
export default {
  "chain": "MRK",
  "chainId": 1909,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://merklescan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZocJpCSLoQqoYFkF1kn7uKDuAiFRNTK8P5PoVeiigDBU",
    "width": 114,
    "height": 132,
    "format": "png"
  },
  "infoURL": "https://merklescan.com",
  "name": "Merkle Scan",
  "nativeCurrency": {
    "name": "Merkle",
    "symbol": "MRK",
    "decimals": 18
  },
  "networkId": 1909,
  "rpc": [
    "https://1909.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://marklechain-rpc.merklescan.com"
  ],
  "shortName": "MRK",
  "slug": "merkle-scan",
  "testnet": false
} as const satisfies Chain;