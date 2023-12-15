import type { Chain } from "../src/types";
export default {
  "chain": "Hedera",
  "chainId": 295,
  "explorers": [
    {
      "name": "HashScan",
      "url": "https://hashscan.io/mainnet",
      "standard": "EIP3091"
    },
    {
      "name": "Arkhia Explorer",
      "url": "https://explorer.arkhia.io",
      "standard": "none"
    },
    {
      "name": "DragonGlass",
      "url": "https://app.dragonglass.me",
      "standard": "none"
    },
    {
      "name": "Hedera Explorer",
      "url": "https://hederaexplorer.io",
      "standard": "none"
    },
    {
      "name": "Ledger Works Explore",
      "url": "https://explore.lworks.io",
      "standard": "none"
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
    "url": "ipfs://QmQikzhvZKyMmbZJd7BVLZb2YTBDMgNDnaMCAErsVjsfuz",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "infoURL": "https://hedera.com",
  "name": "Hedera Mainnet",
  "nativeCurrency": {
    "name": "hbar",
    "symbol": "HBAR",
    "decimals": 18
  },
  "networkId": 295,
  "rpc": [
    "https://hedera.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://295.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.hashio.io/api"
  ],
  "shortName": "hedera-mainnet",
  "slip44": 3030,
  "slug": "hedera",
  "testnet": false
} as const satisfies Chain;