import type { Chain } from "../src/types";
export default {
  "chain": "GAN",
  "chainId": 4048,
  "explorers": [
    {
      "name": "ganscan",
      "url": "https://ganscan.gpu.net",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTYgL4PMNJya3XchuRx99ggNzMHL9kWaZvj3wycdEwpQA",
    "width": 1248,
    "height": 1197,
    "format": "png"
  },
  "infoURL": "https://docs.gpu.net/",
  "name": "GAN Testnet",
  "nativeCurrency": {
    "name": "GP Token",
    "symbol": "GP",
    "decimals": 18
  },
  "networkId": 4048,
  "rpc": [
    "https://4048.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gpu.net"
  ],
  "shortName": "GANTestnet",
  "slug": "gan-testnet",
  "testnet": true
} as const satisfies Chain;