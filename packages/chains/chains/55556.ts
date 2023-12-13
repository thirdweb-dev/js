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
  "icon": {
    "url": "ipfs://QmNy5d5knHVjJJS9g4kLsh9i73RTjckpKL6KZvRk6ptbhf",
    "width": 591,
    "height": 591,
    "format": "svg"
  },
  "infoURL": "https://reichain.io",
  "name": "REI Chain Testnet",
  "nativeCurrency": {
    "name": "tRei",
    "symbol": "tREI",
    "decimals": 18
  },
  "networkId": 55556,
  "rpc": [
    "https://rei-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://55556.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rei-testnet-rpc.moonrhythm.io"
  ],
  "shortName": "trei",
  "slug": "rei-chain-testnet",
  "testnet": true
} as const satisfies Chain;