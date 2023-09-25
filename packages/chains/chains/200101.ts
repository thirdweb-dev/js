import type { Chain } from "../src/types";
export default {
  "chainId": 200101,
  "chain": "milkTAda",
  "name": "Milkomeda C1 Testnet",
  "rpc": [
    "https://milkomeda-c1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-devnet-cardano-evm.c1.milkomeda.com",
    "wss://rpc-devnet-cardano-evm.c1.milkomeda.com"
  ],
  "slug": "milkomeda-c1-testnet",
  "icon": {
    "url": "ipfs://QmdoUtvHDybu5ppYBZT8BMRp6AqByVSoQs8nFwKbaS55jd",
    "width": 367,
    "height": 367,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "milkTAda",
    "symbol": "mTAda",
    "decimals": 18
  },
  "infoURL": "https://milkomeda.com",
  "shortName": "milkTAda",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-devnet-cardano-evm.c1.milkomeda.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;