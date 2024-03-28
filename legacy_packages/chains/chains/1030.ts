import type { Chain } from "../src/types";
export default {
  "chain": "Conflux",
  "chainId": 1030,
  "explorers": [
    {
      "name": "Conflux Scan",
      "url": "https://evm.confluxscan.net",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreifj7n24u2dslfijfihwqvpdeigt5aj3k3sxv6s35lv75sxsfr3ojy",
    "width": 460,
    "height": 576,
    "format": "png"
  },
  "infoURL": "https://confluxnetwork.org",
  "name": "Conflux eSpace",
  "nativeCurrency": {
    "name": "CFX",
    "symbol": "CFX",
    "decimals": 18
  },
  "networkId": 1030,
  "rpc": [
    "https://1030.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.confluxrpc.com"
  ],
  "shortName": "cfx",
  "slug": "conflux-espace",
  "testnet": false
} as const satisfies Chain;