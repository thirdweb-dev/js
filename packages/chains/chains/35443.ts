import type { Chain } from "../src/types";
export default {
  "chain": "Q",
  "chainId": 35443,
  "explorers": [
    {
      "name": "Q explorer",
      "url": "https://explorer.qtestnet.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQUQKe8VEtSthhgXnJ3EmEz94YhpVCpUDZAiU9KYyNLya",
    "width": 585,
    "height": 603,
    "format": "png"
  },
  "infoURL": "https://q.org/",
  "name": "Q Testnet",
  "nativeCurrency": {
    "name": "Q token",
    "symbol": "Q",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://q-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.qtestnet.org"
  ],
  "shortName": "q-testnet",
  "slug": "q-testnet",
  "testnet": true
} as const satisfies Chain;