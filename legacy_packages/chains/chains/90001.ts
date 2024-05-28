import type { Chain } from "../src/types";
export default {
  "chain": "Fxcore",
  "chainId": 90001,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://functionx.io/",
  "name": "F(x)Core Testnet Network",
  "nativeCurrency": {
    "name": "Function X",
    "symbol": "FX",
    "decimals": 18
  },
  "networkId": 90001,
  "rpc": [
    "https://90001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-fx-json-web3.functionx.io:8545"
  ],
  "shortName": "dhobyghaut",
  "slug": "f-x-core-testnet-network",
  "testnet": true
} as const satisfies Chain;