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
  "features": [],
  "icon": {
    "url": "ipfs://QmdoUtvHDybu5ppYBZT8BMRp6AqByVSoQs8nFwKbaS55jd",
    "width": 367,
    "height": 367,
    "format": "svg"
  },
  "infoURL": "https://milkomeda.com",
  "name": "Milkomeda A1 Testnet",
  "nativeCurrency": {
    "name": "milkTAlgo",
    "symbol": "mTAlgo",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://milkomeda-a1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-devnet-algorand-rollup.a1.milkomeda.com"
  ],
  "shortName": "milkTAlgo",
  "slug": "milkomeda-a1-testnet",
  "testnet": true
} as const satisfies Chain;