import type { Chain } from "../src/types";
export default {
  "chain": "NEUTR",
  "chainId": 197,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.neutrinoschain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://neutrinoschain.com/faucet"
  ],
  "features": [],
  "infoURL": "https://docs.neutrinoschain.com",
  "name": "Neutrinos TestNet",
  "nativeCurrency": {
    "name": "Neutrinos",
    "symbol": "NEUTR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://neutrinos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.neutrinoschain.com"
  ],
  "shortName": "NEUTR",
  "slug": "neutrinos-testnet",
  "testnet": true
} as const satisfies Chain;