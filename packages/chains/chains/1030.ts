import type { Chain } from "../src/types";
export default {
  "chainId": 1030,
  "chain": "Conflux",
  "name": "Conflux eSpace",
  "rpc": [
    "https://conflux-espace.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.confluxrpc.com"
  ],
  "slug": "conflux-espace",
  "icon": {
    "url": "ipfs://bafkreifj7n24u2dslfijfihwqvpdeigt5aj3k3sxv6s35lv75sxsfr3ojy",
    "width": 460,
    "height": 576,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "CFX",
    "symbol": "CFX",
    "decimals": 18
  },
  "infoURL": "https://confluxnetwork.org",
  "shortName": "cfx",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Conflux Scan",
      "url": "https://evm.confluxscan.net",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;