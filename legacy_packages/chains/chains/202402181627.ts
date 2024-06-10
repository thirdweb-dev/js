import type { Chain } from "../src/types";
export default {
  "chain": "GM Network Testnet",
  "chainId": 202402181627,
  "explorers": [
    {
      "name": "gmnetwork-testnet",
      "url": "https://gmnetwork-testnet-explorer.alt.technology",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://gmnetwork.ai",
  "name": "GM Network Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 202402181627,
  "rpc": [
    "https://202402181627.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gmnetwork-testnet.alt.technology/"
  ],
  "shortName": "gmnetwork-testnet",
  "slug": "gm-network-testnet",
  "testnet": true
} as const satisfies Chain;