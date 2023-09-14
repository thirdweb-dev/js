import type { Chain } from "../src/types";
export default {
  "name": "Manta Pacific Mainnet",
  "chain": "Manta Pacific",
  "rpc": [
    "https://manta-pacific.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pacific-rpc.manta.network/http"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
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
  "infoURL": "https://pacific-info.manta.network",
  "shortName": "manta",
  "chainId": 169,
  "networkId": 169,
  "icon": {
    "url": "ipfs://QmTckcVTViRZ3NqT36MTt8AvgBSmudrbgU3pi8AaNtthoV",
    "width": 834,
    "height": 834,
    "format": "png"
  },
  "explorers": [
    {
      "name": "manta-pacific Explorer",
      "url": "https://pacific-explorer.manta.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "manta-pacific"
} as const satisfies Chain;