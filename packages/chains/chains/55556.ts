import type { Chain } from "../src/types";
export default {
  "chainId": 55556,
  "chain": "REI",
  "name": "REI Chain Testnet",
  "rpc": [
    "https://rei-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rei-testnet-rpc.moonrhythm.io"
  ],
  "slug": "rei-chain-testnet",
  "icon": {
    "url": "ipfs://QmNy5d5knHVjJJS9g4kLsh9i73RTjckpKL6KZvRk6ptbhf",
    "width": 591,
    "height": 591,
    "format": "svg"
  },
  "faucets": [
    "http://kururu.finance/faucet?chainId=55556"
  ],
  "nativeCurrency": {
    "name": "tRei",
    "symbol": "tREI",
    "decimals": 18
  },
  "infoURL": "https://reichain.io",
  "shortName": "trei",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "reiscan",
      "url": "https://testnet.reiscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;