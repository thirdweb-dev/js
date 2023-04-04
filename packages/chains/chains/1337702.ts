import type { Chain } from "../src/types";
export default {
  "name": "Kintsugi",
  "title": "Kintsugi merge testnet",
  "chain": "ETH",
  "rpc": [
    "https://kintsugi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kintsugi.themerge.dev"
  ],
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
  "chainId": 1337702,
  "networkId": 1337702,
  "explorers": [
    {
      "name": "kintsugi explorer",
      "url": "https://explorer.kintsugi.themerge.dev",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "kintsugi"
} as const satisfies Chain;