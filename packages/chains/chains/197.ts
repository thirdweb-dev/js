import type { Chain } from "../src/types";
export default {
  "name": "Neutrinos TestNet",
  "chain": "NEUTR",
  "rpc": [
    "https://neutrinos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.neutrinoschain.com"
  ],
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
  "chainId": 197,
  "networkId": 197,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.neutrinoschain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "neutrinos-testnet"
} as const satisfies Chain;