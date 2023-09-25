import type { Chain } from "../src/types";
export default {
  "chainId": 2001,
  "chain": "milkAda",
  "name": "Milkomeda C1 Mainnet",
  "rpc": [
    "https://milkomeda-c1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet-cardano-evm.c1.milkomeda.com",
    "wss://rpc-mainnet-cardano-evm.c1.milkomeda.com"
  ],
  "slug": "milkomeda-c1",
  "icon": {
    "url": "ipfs://QmdoUtvHDybu5ppYBZT8BMRp6AqByVSoQs8nFwKbaS55jd",
    "width": 367,
    "height": 367,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "milkAda",
    "symbol": "mADA",
    "decimals": 18
  },
  "infoURL": "https://milkomeda.com",
  "shortName": "milkAda",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-mainnet-cardano-evm.c1.milkomeda.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;