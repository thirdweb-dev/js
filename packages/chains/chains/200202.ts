import type { Chain } from "../src/types";
export default {
  "chainId": 200202,
  "chain": "milkTAlgo",
  "name": "Milkomeda A1 Testnet",
  "rpc": [
    "https://milkomeda-a1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-devnet-algorand-rollup.a1.milkomeda.com"
  ],
  "slug": "milkomeda-a1-testnet",
  "icon": {
    "url": "ipfs://QmdoUtvHDybu5ppYBZT8BMRp6AqByVSoQs8nFwKbaS55jd",
    "width": 367,
    "height": 367,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "milkTAlgo",
    "symbol": "mTAlgo",
    "decimals": 18
  },
  "infoURL": "https://milkomeda.com",
  "shortName": "milkTAlgo",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-devnet-algorand-rollup.a1.milkomeda.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;