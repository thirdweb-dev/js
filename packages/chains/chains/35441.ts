import type { Chain } from "../src/types";
export default {
  "chain": "Q",
  "chainId": 35441,
  "explorers": [
    {
      "name": "Q explorer",
      "url": "https://explorer.q.org",
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
  "infoURL": "https://q.org",
  "name": "Q Mainnet",
  "nativeCurrency": {
    "name": "Q token",
    "symbol": "Q",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://q.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.q.org"
  ],
  "shortName": "q",
  "slug": "q",
  "testnet": false
} as const satisfies Chain;