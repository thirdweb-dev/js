import type { Chain } from "../src/types";
export default {
  "chain": "NUTRIEMP",
  "chainId": 420000,
  "explorers": [
    {
      "name": "Nutriemp-chain.link",
      "url": "https://explorer.nutriemp-chain.link",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafybeih7p2zkgxc6i6ygihz556y22aruacwybtfaif7554hqnd2a745uce/",
        "width": 1080,
        "height": 1080,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeih7p2zkgxc6i6ygihz556y22aruacwybtfaif7554hqnd2a745uce/",
    "width": 1080,
    "height": 1080,
    "format": "png"
  },
  "name": "NutriEmp-Chain",
  "nativeCurrency": {
    "name": "GRAMZ",
    "symbol": "GRAMZ",
    "decimals": 18
  },
  "networkId": 420000,
  "redFlags": [],
  "rpc": [
    "https://420000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.nutriemp-chain.link"
  ],
  "shortName": "GRAMZ",
  "slug": "nutriemp-chain",
  "testnet": false
} as const satisfies Chain;