import type { Chain } from "../src/types";
export default {
  "chainId": 35441,
  "chain": "Q",
  "name": "Q Mainnet",
  "rpc": [
    "https://q.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.q.org"
  ],
  "slug": "q",
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
  "infoURL": "https://q.org",
  "shortName": "q",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Q explorer",
      "url": "https://explorer.q.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;