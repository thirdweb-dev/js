import type { Chain } from "../src/types";
export default {
  "chain": "Conflux",
  "chainId": 71,
  "explorers": [
    {
      "name": "Conflux Scan",
      "url": "https://evmtestnet.confluxscan.net",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.confluxnetwork.org"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreifj7n24u2dslfijfihwqvpdeigt5aj3k3sxv6s35lv75sxsfr3ojy",
    "width": 460,
    "height": 576,
    "format": "png"
  },
  "infoURL": "https://confluxnetwork.org",
  "name": "Conflux eSpace (Testnet)",
  "nativeCurrency": {
    "name": "CFX",
    "symbol": "CFX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://conflux-espace-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmtestnet.confluxrpc.com"
  ],
  "shortName": "cfxtest",
  "slug": "conflux-espace-testnet",
  "testnet": true
} as const satisfies Chain;