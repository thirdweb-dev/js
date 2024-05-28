import type { Chain } from "../src/types";
export default {
  "chain": "REI",
  "chainId": 55556,
  "explorers": [
    {
      "name": "reiscan",
      "url": "https://testnet.reiscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://kururu.finance/faucet?chainId=55556"
  ],
  "infoURL": "https://reichain.io",
  "name": "REI Chain Testnet",
  "nativeCurrency": {
    "name": "tRei",
    "symbol": "tREI",
    "decimals": 18
  },
  "networkId": 55556,
  "rpc": [
    "https://55556.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rei-testnet-rpc.moonrhythm.io"
  ],
  "shortName": "trei",
  "slip44": 1,
  "slug": "rei-chain-testnet",
  "testnet": true
} as const satisfies Chain;