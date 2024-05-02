import type { Chain } from "../src/types";
export default {
  "chain": "GDCC",
  "chainId": 7775,
  "explorers": [
    {
      "name": "GDCC",
      "url": "https://testnet.gdccscan.io",
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
  "name": "GDCC TESTNET",
  "nativeCurrency": {
    "name": "GDCC",
    "symbol": "GDCC",
    "decimals": 18
  },
  "networkId": 7775,
  "rpc": [
    "https://7775.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc1.gdccscan.io"
  ],
  "shortName": "GDCC",
  "slug": "gdcc-testnet",
  "testnet": true
} as const satisfies Chain;