import type { Chain } from "../types";
export default {
  "chain": "Manta Pacific",
  "chainId": 3441005,
  "explorers": [
    {
      "name": "manta-testnet Explorer",
      "url": "https://manta-testnet.calderaexplorer.xyz",
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
  "infoURL": "https://manta-testnet.caldera.dev/",
  "name": "Manta Pacific Testnet",
  "nativeCurrency": {
    "name": "Manta",
    "symbol": "MANTA",
    "decimals": 18
  },
  "networkId": 3441005,
  "rpc": [
    "https://manta-pacific-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3441005.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://manta-testnet.calderachain.xyz/http"
  ],
  "shortName": "mantaTestnet",
  "slug": "manta-pacific-testnet",
  "testnet": true
} as const satisfies Chain;