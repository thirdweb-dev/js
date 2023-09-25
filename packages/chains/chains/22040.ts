import type { Chain } from "../src/types";
export default {
  "chainId": 22040,
  "chain": "ambnet-test",
  "name": "AirDAO Testnet",
  "rpc": [
    "https://airdao-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://network.ambrosus-test.io"
  ],
  "slug": "airdao-testnet",
  "icon": {
    "url": "ipfs://QmSxXjvWng3Diz4YwXDV2VqSPgMyzLYBNfkjJcr7rzkxom",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Amber",
    "symbol": "AMB",
    "decimals": 18
  },
  "infoURL": "https://testnet.airdao.io",
  "shortName": "airdao-test",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "AirDAO Network Explorer",
      "url": "https://testnet.airdao.io/explorer",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;