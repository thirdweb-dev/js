import type { Chain } from "../src/types";
export default {
  "chainId": 298,
  "chain": "Hedera",
  "name": "Hedera Localnet",
  "rpc": [],
  "slug": "hedera-localnet",
  "icon": {
    "url": "ipfs://QmQikzhvZKyMmbZJd7BVLZb2YTBDMgNDnaMCAErsVjsfuz",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "hbar",
    "symbol": "HBAR",
    "decimals": 18
  },
  "infoURL": "https://hedera.com",
  "shortName": "hedera-localnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;