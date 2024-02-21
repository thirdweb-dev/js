import type { Chain } from "../src/types";
export default {
  "chain": "Testnet-anvil",
  "chainId": 2153,
  "explorers": [
    {
      "name": "findorascan",
      "url": "https://testnet-anvil.evm.findorascan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://findora.org/",
  "name": "Findora Testnet",
  "nativeCurrency": {
    "name": "FRA",
    "symbol": "FRA",
    "decimals": 18
  },
  "networkId": 2153,
  "rpc": [
    "https://2153.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://prod-testnet.prod.findora.org:8545/"
  ],
  "shortName": "findora-testnet",
  "slip44": 1,
  "slug": "findora-testnet",
  "testnet": true
} as const satisfies Chain;