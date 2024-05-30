import type { Chain } from "../src/types";
export default {
  "chain": "Fxcore",
  "chainId": 530,
  "explorers": [
    {
      "name": "FunctionX Explorer",
      "url": "https://fx-evm.functionx.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmauD5hzc5q1VgEU1nT4AGLCeV79CB8GgfnXXeeLmBZVHf",
    "width": 36,
    "height": 36,
    "format": "png"
  },
  "infoURL": "https://functionx.io/",
  "name": "F(x)Core Mainnet Network",
  "nativeCurrency": {
    "name": "Function X",
    "symbol": "FX",
    "decimals": 18
  },
  "networkId": 530,
  "rpc": [
    "https://530.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fx-json-web3.functionx.io:8545"
  ],
  "shortName": "FxCore",
  "slug": "f-x-core-network",
  "testnet": false
} as const satisfies Chain;