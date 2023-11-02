import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 588,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://stardust-explorer.metis.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.metis.io",
  "name": "Metis Stardust Testnet",
  "nativeCurrency": {
    "name": "tMetis",
    "symbol": "METIS",
    "decimals": 18
  },
  "networkId": 588,
  "parent": {
    "type": "L2",
    "chain": "eip155-4",
    "bridges": [
      {
        "url": "https://bridge.metis.io"
      }
    ]
  },
  "rpc": [
    "https://metis-stardust-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://588.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://stardust.metis.io/?owner=588"
  ],
  "shortName": "metis-stardust",
  "slug": "metis-stardust-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;