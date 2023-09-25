import type { Chain } from "../src/types";
export default {
  "chainId": 55555,
  "chain": "REI",
  "name": "REI Chain Mainnet",
  "rpc": [
    "https://rei-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rei-rpc.moonrhythm.io"
  ],
  "slug": "rei-chain",
  "icon": {
    "url": "ipfs://QmNy5d5knHVjJJS9g4kLsh9i73RTjckpKL6KZvRk6ptbhf",
    "width": 591,
    "height": 591,
    "format": "svg"
  },
  "faucets": [
    "http://kururu.finance/faucet?chainId=55555"
  ],
  "nativeCurrency": {
    "name": "Rei",
    "symbol": "REI",
    "decimals": 18
  },
  "infoURL": "https://reichain.io",
  "shortName": "reichain",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "reiscan",
      "url": "https://reiscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;