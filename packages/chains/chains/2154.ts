import type { Chain } from "../src/types";
export default {
  "chain": "Testnet-forge",
  "chainId": 2154,
  "explorers": [
    {
      "name": "findorascan",
      "url": "https://testnet-forge.evm.findorascan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://findora.org/",
  "name": "Findora Forge",
  "nativeCurrency": {
    "name": "FRA",
    "symbol": "FRA",
    "decimals": 18
  },
  "networkId": 2154,
  "rpc": [
    "https://findora-forge.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2154.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://prod-forge.prod.findora.org:8545/"
  ],
  "shortName": "findora-forge",
  "slip44": 1,
  "slug": "findora-forge",
  "testnet": true
} as const satisfies Chain;