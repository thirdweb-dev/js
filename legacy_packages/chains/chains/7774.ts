import type { Chain } from "../src/types";
export default {
  "chain": "GDCC",
  "chainId": 7774,
  "explorers": [
    {
      "name": "GDCC",
      "url": "https://gdccscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmY4vp1mJoGpUiuWbRVenNiDZC17wSyyueGPK9A5QyK1M2",
    "width": 72,
    "height": 72,
    "format": "png"
  },
  "infoURL": "https://gdcchain.com",
  "name": "GDCC MAINNET",
  "nativeCurrency": {
    "name": "GDCC",
    "symbol": "GDCC",
    "decimals": 18
  },
  "networkId": 7774,
  "rpc": [
    "https://7774.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc-1.gdccscan.io"
  ],
  "shortName": "GdccMainnet",
  "slug": "gdcc",
  "testnet": false
} as const satisfies Chain;