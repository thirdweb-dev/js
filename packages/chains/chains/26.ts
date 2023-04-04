import type { Chain } from "../src/types";
export default {
  "name": "Genesis L1 testnet",
  "chain": "genesis",
  "rpc": [
    "https://genesis-l1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.genesisl1.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "L1 testcoin",
    "symbol": "L1test",
    "decimals": 18
  },
  "infoURL": "https://www.genesisl1.com",
  "shortName": "L1test",
  "chainId": 26,
  "networkId": 26,
  "explorers": [
    {
      "name": "Genesis L1 testnet explorer",
      "url": "https://testnet.genesisl1.org",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "genesis-l1-testnet"
} as const satisfies Chain;