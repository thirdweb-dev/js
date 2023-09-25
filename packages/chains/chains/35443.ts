import type { Chain } from "../src/types";
export default {
  "chainId": 35443,
  "chain": "Q",
  "name": "Q Testnet",
  "rpc": [
    "https://q-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.qtestnet.org"
  ],
  "slug": "q-testnet",
  "icon": {
    "url": "ipfs://QmQUQKe8VEtSthhgXnJ3EmEz94YhpVCpUDZAiU9KYyNLya",
    "width": 585,
    "height": 603,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Q token",
    "symbol": "Q",
    "decimals": 18
  },
  "infoURL": "https://q.org/",
  "shortName": "q-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Q explorer",
      "url": "https://explorer.qtestnet.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;