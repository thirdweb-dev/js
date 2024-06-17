import type { Chain } from "../src/types";
export default {
  "chain": "milkTAlgo",
  "chainId": 200202,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-devnet-algorand-rollup.a1.milkomeda.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://milkomeda.com",
  "name": "Milkomeda A1 Testnet",
  "nativeCurrency": {
    "name": "milkTAlgo",
    "symbol": "mTAlgo",
    "decimals": 18
  },
  "networkId": 200202,
  "rpc": [
    "https://200202.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-devnet-algorand-rollup.a1.milkomeda.com"
  ],
  "shortName": "milkTAlgo",
  "slip44": 1,
  "slug": "milkomeda-a1-testnet",
  "testnet": true
} as const satisfies Chain;