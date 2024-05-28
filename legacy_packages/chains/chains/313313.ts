import type { Chain } from "../src/types";
export default {
  "chain": "Sahara",
  "chainId": 313313,
  "explorers": [
    {
      "name": "Testnet Scan",
      "url": "https://explorer.saharaa.info",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmQXCm6w8xvWMkksTQYw3So14VCbwHP6chH41v6ysXdSwF",
    "width": 608,
    "height": 608,
    "format": "svg"
  },
  "infoURL": "https://saharalabs.ai",
  "name": "SaharaAI Testnet",
  "nativeCurrency": {
    "name": "SAHARA",
    "symbol": "SAH",
    "decimals": 18
  },
  "networkId": 313313,
  "rpc": [
    "https://313313.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.saharalabs.ai"
  ],
  "shortName": "saharatest",
  "slug": "saharaai-testnet",
  "testnet": true
} as const satisfies Chain;