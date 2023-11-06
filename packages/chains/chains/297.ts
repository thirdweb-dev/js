import type { Chain } from "../src/types";
export default {
  "chain": "Hedera",
  "chainId": 297,
  "explorers": [
    {
      "name": "HashScan",
      "url": "https://hashscan.io/previewnet/dashboard",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://portal.hedera.com"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmQikzhvZKyMmbZJd7BVLZb2YTBDMgNDnaMCAErsVjsfuz",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "infoURL": "https://hedera.com",
  "name": "Hedera Previewnet",
  "nativeCurrency": {
    "name": "hbar",
    "symbol": "HBAR",
    "decimals": 18
  },
  "networkId": 297,
  "rpc": [
    "https://hedera-previewnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://297.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://previewnet.hashio.io/api"
  ],
  "shortName": "hedera-previewnet",
  "slip44": 3030,
  "slug": "hedera-previewnet",
  "testnet": false
} as const satisfies Chain;