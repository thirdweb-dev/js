import type { Chain } from "../src/types";
export default {
  "chain": "Muster",
  "chainId": 4078,
  "explorers": [
    {
      "name": "Musterscan",
      "url": "https://muster-explorer.alt.technology",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "name": "Muster Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 4078,
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": []
  },
  "rpc": [
    "https://4078.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://muster.alt.technology"
  ],
  "shortName": "muster",
  "slug": "muster",
  "testnet": false
} as const satisfies Chain;