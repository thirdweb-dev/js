import type { Chain } from "../src/types";
export default {
  "chainId": 71,
  "chain": "Conflux",
  "name": "Conflux eSpace (Testnet)",
  "rpc": [
    "https://conflux-espace-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmtestnet.confluxrpc.com"
  ],
  "slug": "conflux-espace-testnet",
  "icon": {
    "url": "ipfs://bafkreifj7n24u2dslfijfihwqvpdeigt5aj3k3sxv6s35lv75sxsfr3ojy",
    "width": 460,
    "height": 576,
    "format": "png"
  },
  "faucets": [
    "https://faucet.confluxnetwork.org"
  ],
  "nativeCurrency": {
    "name": "CFX",
    "symbol": "CFX",
    "decimals": 18
  },
  "infoURL": "https://confluxnetwork.org",
  "shortName": "cfxtest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Conflux Scan",
      "url": "https://evmtestnet.confluxscan.net",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;