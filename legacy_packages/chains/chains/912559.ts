import type { Chain } from "../src/types";
export default {
  "chain": "RIA",
  "chainId": 912559,
  "explorers": [
    {
      "name": "Astria EVM Dusknet Explorer",
      "url": "https://explorer.evm.dusk-3.devnet.astria.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.evm.dusk-3.devnet.astria.org/"
  ],
  "infoURL": "https://docs.astria.org",
  "name": "Astria EVM Dusknet",
  "nativeCurrency": {
    "name": "RIA",
    "symbol": "RIA",
    "decimals": 18
  },
  "networkId": 912559,
  "rpc": [
    "https://912559.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.evm.dusk-3.devnet.astria.org"
  ],
  "shortName": "ria-dev",
  "slug": "astria-evm-dusknet",
  "testnet": false
} as const satisfies Chain;