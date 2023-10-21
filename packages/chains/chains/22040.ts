import type { Chain } from "../src/types";
export default {
  "chain": "ambnet-test",
  "chainId": 22040,
  "explorers": [
    {
      "name": "AirDAO Network Explorer",
      "url": "https://testnet.airdao.io/explorer",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmSxXjvWng3Diz4YwXDV2VqSPgMyzLYBNfkjJcr7rzkxom",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://testnet.airdao.io",
  "name": "AirDAO Testnet",
  "nativeCurrency": {
    "name": "Amber",
    "symbol": "AMB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://airdao-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://network.ambrosus-test.io"
  ],
  "shortName": "airdao-test",
  "slug": "airdao-testnet",
  "testnet": true
} as const satisfies Chain;