import type { Chain } from "../src/types";
export default {
  "chainId": 297,
  "chain": "Hedera",
  "name": "Hedera Previewnet",
  "rpc": [
    "https://hedera-previewnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://previewnet.hashio.io/api"
  ],
  "slug": "hedera-previewnet",
  "icon": {
    "url": "ipfs://QmQikzhvZKyMmbZJd7BVLZb2YTBDMgNDnaMCAErsVjsfuz",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "faucets": [
    "https://portal.hedera.com"
  ],
  "nativeCurrency": {
    "name": "hbar",
    "symbol": "HBAR",
    "decimals": 18
  },
  "infoURL": "https://hedera.com",
  "shortName": "hedera-previewnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "HashScan",
      "url": "https://hashscan.io/previewnet/dashboard",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;