import type { Chain } from "../src/types";
export default {
  "chainId": 3441005,
  "chain": "Manta Pacific",
  "name": "Manta Pacific Testnet",
  "rpc": [
    "https://manta-pacific-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://manta-testnet.calderachain.xyz/http"
  ],
  "slug": "manta-pacific-testnet",
  "icon": {
    "url": "ipfs://QmTckcVTViRZ3NqT36MTt8AvgBSmudrbgU3pi8AaNtthoV",
    "width": 834,
    "height": 834,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Manta",
    "symbol": "MANTA",
    "decimals": 18
  },
  "infoURL": "https://manta-testnet.caldera.dev/",
  "shortName": "mantaTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "manta-testnet Explorer",
      "url": "https://manta-testnet.calderaexplorer.xyz",
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