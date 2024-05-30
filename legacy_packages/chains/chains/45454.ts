import type { Chain } from "../src/types";
export default {
  "chain": "SWP",
  "chainId": 45454,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://swamps-explorer.tc.l2aas.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTEEgWsknzdqjLbaAvLHqCCzCtMJZh2d1SqMscxZCXBwA",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "infoURL": "https://www.swamps.fi",
  "name": "Swamps L2",
  "nativeCurrency": {
    "name": "SWP",
    "symbol": "SWP",
    "decimals": 18
  },
  "networkId": 45454,
  "rpc": [
    "https://45454.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://swamps.tc.l2aas.com"
  ],
  "shortName": "SWP",
  "slug": "swamps-l2",
  "testnet": false
} as const satisfies Chain;