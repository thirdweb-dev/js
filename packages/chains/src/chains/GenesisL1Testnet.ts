import type { Chain } from "../types";
export default {
  "chain": "genesis",
  "chainId": 26,
  "explorers": [
    {
      "name": "Genesis L1 testnet explorer",
      "url": "https://testnet.genesisl1.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.genesisl1.com",
  "name": "Genesis L1 testnet",
  "nativeCurrency": {
    "name": "L1 testcoin",
    "symbol": "L1test",
    "decimals": 18
  },
  "networkId": 26,
  "rpc": [
    "https://genesis-l1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://26.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.genesisl1.org"
  ],
  "shortName": "L1test",
  "slug": "genesis-l1-testnet",
  "testnet": true
} as const satisfies Chain;