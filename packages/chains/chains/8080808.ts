import type { Chain } from "../src/types";
export default {
  "chain": "Hokum",
  "chainId": 8080808,
  "explorers": [
    {
      "name": "Hokum Explorer",
      "url": "https://explorer.hokum.gg",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmafrUmh1FD48WWQwk6pfW1Y7eA9VQTdpeL387Wt2JFrAd",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://hokum.gg",
  "name": "Hokum",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 8080808,
  "rpc": [
    "https://8080808.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.hokum.gg"
  ],
  "shortName": "hokum",
  "slug": "hokum",
  "testnet": false
} as const satisfies Chain;