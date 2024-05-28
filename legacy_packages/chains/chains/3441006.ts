import type { Chain } from "../src/types";
export default {
  "chain": "Manta Pacific",
  "chainId": 3441006,
  "explorers": [
    {
      "name": "manta-testnet Explorer",
      "url": "https://pacific-explorer.sepolia-testnet.manta.network",
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
  "name": "Manta Pacific Sepolia Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 3441006,
  "rpc": [
    "https://3441006.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pacific-rpc.sepolia-testnet.manta.network/http"
  ],
  "shortName": "mantaSepoliaTestnet",
  "slip44": 1,
  "slug": "manta-pacific-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;