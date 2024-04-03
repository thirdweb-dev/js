import type { Chain } from "../src/types";
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
    "https://26.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.genesisl1.org"
  ],
  "shortName": "L1test",
  "slip44": 1,
  "slug": "genesis-l1-testnet",
  "testnet": true
} as const satisfies Chain;