import type { Chain } from "../src/types";
export default {
  "chain": "ALIENX Hal",
  "chainId": 10241025,
  "explorers": [
    {
      "name": "Hal Explorer",
      "url": "https://hal-explorer.alienxchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWAa7JayD8HCtAMXezzUNcUoi2Rikqpu2WmrHpFBmDEez",
    "width": 480,
    "height": 480,
    "format": "png"
  },
  "infoURL": "https://alienxchain.io/home",
  "name": "ALIENX Hal Testnet",
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 10241025,
  "rpc": [
    "https://10241025.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hal-rpc.alienxchain.io/http",
    "https://hal.rpc.caldera.xyz/http"
  ],
  "shortName": "ALIENXHal",
  "slug": "alienx-hal-testnet",
  "testnet": true
} as const satisfies Chain;