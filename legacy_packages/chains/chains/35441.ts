import type { Chain } from "../src/types";
export default {
  "chain": "Q",
  "chainId": 35441,
  "explorers": [
    {
      "name": "Q explorer",
      "url": "https://explorer.q.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmQUQKe8VEtSthhgXnJ3EmEz94YhpVCpUDZAiU9KYyNLya",
        "width": 585,
        "height": 603,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQUQKe8VEtSthhgXnJ3EmEz94YhpVCpUDZAiU9KYyNLya",
    "width": 585,
    "height": 603,
    "format": "png"
  },
  "infoURL": "https://q.org",
  "name": "Q Mainnet",
  "nativeCurrency": {
    "name": "QGOV",
    "symbol": "QGOV",
    "decimals": 18
  },
  "networkId": 35441,
  "rpc": [
    "https://35441.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.q.org"
  ],
  "shortName": "q",
  "slug": "q",
  "testnet": false
} as const satisfies Chain;