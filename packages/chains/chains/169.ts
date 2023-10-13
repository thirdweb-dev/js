import type { Chain } from "../src/types";
export default {
  "chain": "Manta Pacific",
  "chainId": 169,
  "explorers": [
    {
      "name": "manta-pacific Explorer",
      "url": "https://pacific-explorer.manta.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmTckcVTViRZ3NqT36MTt8AvgBSmudrbgU3pi8AaNtthoV",
    "width": 834,
    "height": 834,
    "format": "png"
  },
  "infoURL": "https://pacific-info.manta.network",
  "name": "Manta Pacific Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://manta-pacific.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pacific-rpc.manta.network/http"
  ],
  "shortName": "manta",
  "slug": "manta-pacific",
  "testnet": false
} as const satisfies Chain;