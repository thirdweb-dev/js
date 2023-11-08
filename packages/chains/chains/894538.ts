import type { Chain } from "../src/types";
export default {
  "chain": "TWT",
  "chainId": 894538,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets-test.avax.network/thirdweb",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmXDGoJKuuwQKzY1Y7ZhgULg8hcmveu6PVaDaYQzEjKwkQ/Thirdweb-Icon-Black-BG.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "thirdweb test subnet",
  "nativeCurrency": {
    "name": "TWT",
    "symbol": "TWT",
    "decimals": 18
  },
  "networkId": 894538,
  "redFlags": [],
  "rpc": [
    "https://thirdweb-test-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://894538.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/thirdweb/testnet/rpc"
  ],
  "shortName": "twt",
  "slug": "thirdweb-test-subnet",
  "testnet": true
} as const satisfies Chain;