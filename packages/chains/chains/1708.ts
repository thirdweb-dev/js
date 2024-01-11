import type { Chain } from "../src/types";
export default {
  "chain": "TBSI",
  "chainId": 1708,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://exp.testnet.blockchain.or.th",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.blockchain.or.th"
  ],
  "infoURL": "https://blockchain.or.th",
  "name": "TBSI Testnet",
  "nativeCurrency": {
    "name": "Jinda",
    "symbol": "JINDA",
    "decimals": 18
  },
  "networkId": 1708,
  "rpc": [
    "https://tbsi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1708.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.blockchain.or.th"
  ],
  "shortName": "tTBSI",
  "slip44": 1,
  "slug": "tbsi-testnet",
  "testnet": true,
  "title": "Thai Blockchain Service Infrastructure Testnet"
} as const satisfies Chain;