import type { Chain } from "../src/types";
export default {
  "chain": "milkTAda",
  "chainId": 200101,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-devnet-cardano-evm.c1.milkomeda.com",
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
  "name": "Milkomeda C1 Testnet",
  "nativeCurrency": {
    "name": "milkTAda",
    "symbol": "mTAda",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://milkomeda-c1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-devnet-cardano-evm.c1.milkomeda.com",
    "wss://rpc-devnet-cardano-evm.c1.milkomeda.com"
  ],
  "shortName": "milkTAda",
  "slug": "milkomeda-c1-testnet",
  "testnet": true
} as const satisfies Chain;