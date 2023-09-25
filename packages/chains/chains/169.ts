import type { Chain } from "../src/types";
export default {
  "chainId": 169,
  "chain": "Manta Pacific",
  "name": "Manta Pacific Mainnet",
  "rpc": [
    "https://manta-pacific.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pacific-rpc.manta.network/http"
  ],
  "slug": "manta-pacific",
  "icon": {
    "url": "ipfs://QmTckcVTViRZ3NqT36MTt8AvgBSmudrbgU3pi8AaNtthoV",
    "width": 834,
    "height": 834,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://pacific-info.manta.network",
  "shortName": "manta",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "manta-pacific Explorer",
      "url": "https://pacific-explorer.manta.network",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;