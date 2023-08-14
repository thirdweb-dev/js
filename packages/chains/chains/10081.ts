import type { Chain } from "../src/types";
export default {
  "name": "Japan Open Chain Testnet",
  "chain": "JOCT",
  "rpc": [
    "https://japan-open-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-1.testnet.japanopenchain.org:8545",
    "https://rpc-2.testnet.japanopenchain.org:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Japan Open Chain Testnet Token",
    "symbol": "JOCT",
    "decimals": 18
  },
  "infoURL": "https://www.japanopenchain.org/",
  "shortName": "joct",
  "chainId": 10081,
  "networkId": 10081,
  "explorers": [
    {
      "name": "Testnet Block Explorer",
      "url": "https://explorer.testnet.japanopenchain.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "japan-open-chain-testnet"
} as const satisfies Chain;