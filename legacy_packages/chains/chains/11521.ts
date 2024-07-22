import type { Chain } from "../src/types";
export default {
  "chain": "SatsChain",
  "chainId": 11521,
  "explorers": [
    {
      "name": "satschain scan",
      "url": "https://scan-satschain.bevm.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreicvi5dgn3wmkquqaicx743xc65dlqvnnuxsbsxq5hbzhaaaksxyo4",
    "width": 457,
    "height": 456,
    "format": "png"
  },
  "infoURL": "https://github.com/BTCSatsNetwork",
  "name": "SatsChain",
  "nativeCurrency": {
    "name": "SATS",
    "symbol": "SATS",
    "decimals": 18
  },
  "networkId": 11521,
  "rpc": [
    "https://11521.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-satschain-1.bevm.io"
  ],
  "shortName": "satschain",
  "slug": "satschain",
  "testnet": false
} as const satisfies Chain;