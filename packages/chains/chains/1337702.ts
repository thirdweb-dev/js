import type { Chain } from "../src/types";
export default {
  "chainId": 1337702,
  "chain": "ETH",
  "name": "Kintsugi",
  "rpc": [
    "https://kintsugi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kintsugi.themerge.dev"
  ],
  "slug": "kintsugi",
  "faucets": [
    "http://fauceth.komputing.org?chain=1337702&address=${ADDRESS}",
    "https://faucet.kintsugi.themerge.dev"
  ],
  "nativeCurrency": {
    "name": "kintsugi Ethere",
    "symbol": "kiETH",
    "decimals": 18
  },
  "infoURL": "https://kintsugi.themerge.dev/",
  "shortName": "kintsugi",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "kintsugi explorer",
      "url": "https://explorer.kintsugi.themerge.dev",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;