import type { Chain } from "../src/types";
export default {
  "chain": "Fxcore",
  "chainId": 90001,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmauD5hzc5q1VgEU1nT4AGLCeV79CB8GgfnXXeeLmBZVHf",
    "width": 36,
    "height": 36,
    "format": "png"
  },
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