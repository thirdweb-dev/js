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
  "infoURL": "https://milkomeda.com",
  "name": "Milkomeda C1 Testnet",
  "nativeCurrency": {
    "name": "milkTAda",
    "symbol": "mTAda",
    "decimals": 18
  },
  "networkId": 200101,
  "rpc": [
    "https://200101.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-devnet-cardano-evm.c1.milkomeda.com",
    "wss://rpc-devnet-cardano-evm.c1.milkomeda.com"
  ],
  "shortName": "milkTAda",
  "slip44": 1,
  "slug": "milkomeda-c1-testnet",
  "testnet": true
} as const satisfies Chain;