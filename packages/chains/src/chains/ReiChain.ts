import type { Chain } from "../types";
export default {
  "chain": "REI",
  "chainId": 55555,
  "explorers": [
    {
      "name": "reiscan",
      "url": "https://reiscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://kururu.finance/faucet?chainId=55555"
  ],
  "icon": {
    "url": "ipfs://QmNy5d5knHVjJJS9g4kLsh9i73RTjckpKL6KZvRk6ptbhf",
    "width": 591,
    "height": 591,
    "format": "svg"
  },
  "infoURL": "https://reichain.io",
  "name": "REI Chain Mainnet",
  "nativeCurrency": {
    "name": "Rei",
    "symbol": "REI",
    "decimals": 18
  },
  "networkId": 55555,
  "rpc": [
    "https://rei-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://55555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rei-rpc.moonrhythm.io"
  ],
  "shortName": "reichain",
  "slug": "rei-chain",
  "testnet": false
} as const satisfies Chain;