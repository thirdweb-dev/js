import type { Chain } from "../src/types";
export default {
  "chainId": 10081,
  "chain": "JOCT",
  "name": "Japan Open Chain Testnet",
  "rpc": [
    "https://japan-open-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-1.testnet.japanopenchain.org:8545",
    "https://rpc-2.testnet.japanopenchain.org:8545"
  ],
  "slug": "japan-open-chain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Japan Open Chain Testnet Token",
    "symbol": "JOCT",
    "decimals": 18
  },
  "infoURL": "https://www.japanopenchain.org/",
  "shortName": "joct",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Testnet Block Explorer",
      "url": "https://explorer.testnet.japanopenchain.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;