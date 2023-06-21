import type { Chain } from "../src/types";
export default {
  "name": "Neurochain Testnet",
  "chain": "NCN",
  "rpc": [
    "https://neurochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nc-rpc-test1.neurochain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Neurochain",
    "symbol": "tNCN",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.neurochain.ai",
  "shortName": "ncnt",
  "chainId": 303,
  "networkId": 303,
  "explorers": [
    {
      "name": "neuroscan",
      "url": "https://testnet.ncnscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "neurochain-testnet"
} as const satisfies Chain;