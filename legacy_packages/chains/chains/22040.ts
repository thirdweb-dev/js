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
  "networkId": 22040,
  "rpc": [
    "https://22040.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://network.ambrosus-test.io"
  ],
  "shortName": "airdao-test",
  "slip44": 1,
  "slug": "airdao-testnet",
  "testnet": true
} as const satisfies Chain;