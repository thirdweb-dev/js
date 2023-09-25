import type { Chain } from "../src/types";
export default {
  "chainId": 2153,
  "chain": "Testnet-anvil",
  "name": "Findora Testnet",
  "rpc": [
    "https://findora-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://prod-testnet.prod.findora.org:8545/"
  ],
  "slug": "findora-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "FRA",
    "symbol": "FRA",
    "decimals": 18
  },
  "infoURL": "https://findora.org/",
  "shortName": "findora-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "findorascan",
      "url": "https://testnet-anvil.evm.findorascan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;