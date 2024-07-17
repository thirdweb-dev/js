import type { Chain } from "../src/types";
export default {
  "chain": "tGURU",
  "chainId": 261,
  "explorers": [
    {
      "name": "guruscan",
      "url": "https://scan.gurunetwork.ai",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://v2.dex.guru/season-pass/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmTDWnSNSCcVPCYD1FKrUirkT2MVrShdVK9dsxAi6eZdbD",
    "width": 70,
    "height": 70,
    "format": "svg"
  },
  "infoURL": "https://gurunetwork.ai",
  "name": "Guru Network Testnet",
  "nativeCurrency": {
    "name": "testGURU",
    "symbol": "tGURU",
    "decimals": 18
  },
  "networkId": 261,
  "rpc": [
    "https://261.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gurunetwork.ai/archive/261"
  ],
  "shortName": "tguru",
  "slug": "guru-network-testnet",
  "testnet": true
} as const satisfies Chain;