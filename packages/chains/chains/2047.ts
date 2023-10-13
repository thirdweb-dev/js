import type { Chain } from "../src/types";
export default {
  "chain": "STOS",
  "chainId": 2047,
  "explorers": [
    {
      "name": "Stratos EVM Explorer (Blockscout)",
      "url": "https://web3-explorer-mesos.thestratos.org",
      "standard": "none"
    },
    {
      "name": "Stratos Cosmos Explorer (BigDipper)",
      "url": "https://big-dipper-mesos.thestratos.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.thestratos.org",
  "name": "Stratos Testnet",
  "nativeCurrency": {
    "name": "STOS",
    "symbol": "STOS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://stratos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://web3-rpc-mesos.thestratos.org"
  ],
  "shortName": "stos-testnet",
  "slug": "stratos-testnet",
  "testnet": true
} as const satisfies Chain;