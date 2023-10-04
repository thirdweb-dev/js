import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1337702,
  "explorers": [
    {
      "name": "kintsugi explorer",
      "url": "https://explorer.kintsugi.themerge.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://fauceth.komputing.org?chain=1337702&address=${ADDRESS}",
    "https://faucet.kintsugi.themerge.dev"
  ],
  "features": [],
  "infoURL": "https://kintsugi.themerge.dev/",
  "name": "Kintsugi",
  "nativeCurrency": {
    "name": "kintsugi Ethere",
    "symbol": "kiETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://kintsugi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kintsugi.themerge.dev"
  ],
  "shortName": "kintsugi",
  "slug": "kintsugi",
  "testnet": true
} as const satisfies Chain;