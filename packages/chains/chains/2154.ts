import type { Chain } from "../src/types";
export default {
  "chainId": 2154,
  "chain": "Testnet-forge",
  "name": "Findora Forge",
  "rpc": [
    "https://findora-forge.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://prod-forge.prod.findora.org:8545/"
  ],
  "slug": "findora-forge",
  "faucets": [],
  "nativeCurrency": {
    "name": "FRA",
    "symbol": "FRA",
    "decimals": 18
  },
  "infoURL": "https://findora.org/",
  "shortName": "findora-forge",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "findorascan",
      "url": "https://testnet-forge.evm.findorascan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;