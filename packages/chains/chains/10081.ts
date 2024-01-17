import type { Chain } from "../src/types";
export default {
  "chain": "JOCT",
  "chainId": 10081,
  "explorers": [
    {
      "name": "Testnet Block Explorer",
      "url": "https://explorer.testnet.japanopenchain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.japanopenchain.org/",
  "name": "Japan Open Chain Testnet",
  "nativeCurrency": {
    "name": "Japan Open Chain Testnet Token",
    "symbol": "JOCT",
    "decimals": 18
  },
  "networkId": 10081,
  "rpc": [
    "https://japan-open-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://10081.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-1.testnet.japanopenchain.org:8545",
    "https://rpc-2.testnet.japanopenchain.org:8545"
  ],
  "shortName": "joct",
  "slip44": 1,
  "slug": "japan-open-chain-testnet",
  "testnet": true
} as const satisfies Chain;