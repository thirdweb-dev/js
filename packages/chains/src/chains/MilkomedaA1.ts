import type { Chain } from "../types";
export default {
  "chain": "milkALGO",
  "chainId": 2002,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-mainnet-algorand-rollup.a1.milkomeda.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdoUtvHDybu5ppYBZT8BMRp6AqByVSoQs8nFwKbaS55jd",
    "width": 367,
    "height": 367,
    "format": "svg"
  },
  "infoURL": "https://milkomeda.com",
  "name": "Milkomeda A1 Mainnet",
  "nativeCurrency": {
    "name": "milkALGO",
    "symbol": "mALGO",
    "decimals": 18
  },
  "networkId": 2002,
  "rpc": [
    "https://milkomeda-a1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet-algorand-rollup.a1.milkomeda.com",
    "wss://rpc-mainnet-algorand-rollup.a1.milkomeda.com/ws"
  ],
  "shortName": "milkALGO",
  "slug": "milkomeda-a1",
  "testnet": false
} as const satisfies Chain;