import type { Chain } from "../src/types";
export default {
  "chainId": 1708,
  "chain": "TBSI",
  "name": "TBSI Testnet",
  "rpc": [
    "https://tbsi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.blockchain.or.th"
  ],
  "slug": "tbsi-testnet",
  "faucets": [
    "https://faucet.blockchain.or.th"
  ],
  "nativeCurrency": {
    "name": "Jinda",
    "symbol": "JINDA",
    "decimals": 18
  },
  "infoURL": "https://blockchain.or.th",
  "shortName": "tTBSI",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://exp.testnet.blockchain.or.th",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;