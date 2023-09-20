import type { Chain } from "../src/types";
export default {
  "name": "Manta Pacific Testnet",
  "chain": "Manta Pacific",
  "rpc": [
    "https://manta-pacific-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://manta-testnet.calderachain.xyz/http"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Manta",
    "symbol": "MANTA",
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
  "infoURL": "https://manta-testnet.caldera.dev/",
  "shortName": "mantaTestnet",
  "chainId": 3441005,
  "networkId": 3441005,
  "icon": {
    "url": "ipfs://QmTckcVTViRZ3NqT36MTt8AvgBSmudrbgU3pi8AaNtthoV",
    "width": 834,
    "height": 834,
    "format": "png"
  },
  "explorers": [
    {
      "name": "manta-testnet Explorer",
      "url": "https://manta-testnet.calderaexplorer.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "manta-pacific-testnet"
} as const satisfies Chain;