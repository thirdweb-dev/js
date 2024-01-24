import type { Chain } from "../src/types";
export default {
  "chain": "HokumTestnet",
  "chainId": 20482050,
  "explorers": [
    {
      "name": "Hokum Explorer",
      "url": "https://testnet-explorer.hokum.gg",
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
  "name": "Hokum Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 20482050,
  "rpc": [
    "https://hokum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://20482050.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.hokum.gg"
  ],
  "shortName": "hokum-testnet",
  "slug": "hokum-testnet",
  "testnet": true
} as const satisfies Chain;