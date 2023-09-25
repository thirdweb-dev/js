import type { Chain } from "../src/types";
export default {
  "chainId": 2002,
  "chain": "milkALGO",
  "name": "Milkomeda A1 Mainnet",
  "rpc": [
    "https://milkomeda-a1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet-algorand-rollup.a1.milkomeda.com",
    "wss://rpc-mainnet-algorand-rollup.a1.milkomeda.com/ws"
  ],
  "slug": "milkomeda-a1",
  "icon": {
    "url": "ipfs://QmdoUtvHDybu5ppYBZT8BMRp6AqByVSoQs8nFwKbaS55jd",
    "width": 367,
    "height": 367,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "milkALGO",
    "symbol": "mALGO",
    "decimals": 18
  },
  "infoURL": "https://milkomeda.com",
  "shortName": "milkALGO",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-mainnet-algorand-rollup.a1.milkomeda.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;