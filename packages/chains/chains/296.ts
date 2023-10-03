import type { Chain } from "../src/types";
export default {
  "chain": "Hedera",
  "chainId": 296,
  "explorers": [
    {
      "name": "HashScan",
      "url": "https://hashscan.io/testnet/dashboard",
      "standard": "none"
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
  "faucets": [
    "https://portal.hedera.com"
  ],
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
  "name": "Hedera Testnet",
  "nativeCurrency": {
    "name": "hbar",
    "symbol": "HBAR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://hedera-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.hashio.io/api"
  ],
  "shortName": "hedera-testnet",
  "slug": "hedera-testnet",
  "testnet": true
} as const satisfies Chain;