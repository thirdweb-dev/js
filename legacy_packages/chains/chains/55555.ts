import type { Chain } from "../src/types";
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
  "infoURL": "https://reichain.io",
  "name": "REI Chain Mainnet",
  "nativeCurrency": {
    "name": "Rei",
    "symbol": "REI",
    "decimals": 18
  },
  "networkId": 55555,
  "rpc": [
    "https://55555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rei-rpc.moonrhythm.io"
  ],
  "shortName": "reichain",
  "slug": "rei-chain",
  "testnet": false
} as const satisfies Chain;