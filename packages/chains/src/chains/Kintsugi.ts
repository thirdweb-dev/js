import type { Chain } from "../types";
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
  "infoURL": "https://kintsugi.themerge.dev/",
  "name": "Kintsugi",
  "nativeCurrency": {
    "name": "kintsugi Ethere",
    "symbol": "kiETH",
    "decimals": 18
  },
  "networkId": 1337702,
  "rpc": [
    "https://kintsugi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1337702.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kintsugi.themerge.dev"
  ],
  "shortName": "kintsugi",
  "slug": "kintsugi",
  "testnet": true,
  "title": "Kintsugi merge testnet"
} as const satisfies Chain;