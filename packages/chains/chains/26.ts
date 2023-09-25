import type { Chain } from "../src/types";
export default {
  "chainId": 26,
  "chain": "genesis",
  "name": "Genesis L1 testnet",
  "rpc": [
    "https://genesis-l1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.genesisl1.org"
  ],
  "slug": "genesis-l1-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "L1 testcoin",
    "symbol": "L1test",
    "decimals": 18
  },
  "infoURL": "https://www.genesisl1.com",
  "shortName": "L1test",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Genesis L1 testnet explorer",
      "url": "https://testnet.genesisl1.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;