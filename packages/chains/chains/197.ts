import type { Chain } from "../src/types";
export default {
  "chainId": 197,
  "chain": "NEUTR",
  "name": "Neutrinos TestNet",
  "rpc": [
    "https://neutrinos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.neutrinoschain.com"
  ],
  "slug": "neutrinos-testnet",
  "faucets": [
    "https://neutrinoschain.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Neutrinos",
    "symbol": "NEUTR",
    "decimals": 18
  },
  "infoURL": "https://docs.neutrinoschain.com",
  "shortName": "NEUTR",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.neutrinoschain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;