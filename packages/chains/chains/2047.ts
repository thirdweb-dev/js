import type { Chain } from "../src/types";
export default {
  "chainId": 2047,
  "chain": "STOS",
  "name": "Stratos Testnet",
  "rpc": [
    "https://stratos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://web3-rpc-mesos.thestratos.org"
  ],
  "slug": "stratos-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "STOS",
    "symbol": "STOS",
    "decimals": 18
  },
  "infoURL": "https://www.thestratos.org",
  "shortName": "stos-testnet",
  "testnet": true,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;