import type { Chain } from "../src/types";
export default {
  "chain": "tIMP",
  "chainId": 9818,
  "explorers": [
    {
      "name": "IMPERIUM TESTNET Explorer",
      "url": "https://network.impscan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.imperiumchain.com/"
  ],
  "infoURL": "https://imperiumchain.com",
  "name": "IMPERIUM TESTNET",
  "nativeCurrency": {
    "name": "tIMP",
    "symbol": "tIMP",
    "decimals": 18
  },
  "networkId": 9818,
  "rpc": [
    "https://9818.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-aws-testnet.imperiumchain.com",
    "https://data-aws2-testnet.imperiumchain.com"
  ],
  "shortName": "tIMP",
  "slip44": 1,
  "slug": "imperium-testnet",
  "testnet": true
} as const satisfies Chain;