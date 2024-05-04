import type { Chain } from "../src/types";
export default {
  "chain": "Sahara",
  "chainId": 3132023,
  "explorers": [],
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
  "name": "SaharaAI Network",
  "nativeCurrency": {
    "name": "SAHARA",
    "symbol": "SAH",
    "decimals": 18
  },
  "networkId": 3132023,
  "rpc": [
    "https://3132023.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.saharalabs.ai"
  ],
  "shortName": "sahara",
  "slug": "saharaai-network",
  "testnet": false
} as const satisfies Chain;