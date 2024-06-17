import type { Chain } from "../src/types";
export default {
  "chain": "MXC zkEVM",
  "chainId": 18686,
  "explorers": [
    {
      "name": "MXC zkEVM Moonchain",
      "url": "https://explorer.moonchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://doc.mxc.com/docs/intro",
  "name": "MXC zkEVM Moonchain",
  "nativeCurrency": {
    "name": "MXC zkEVM Moonchain",
    "symbol": "MXC",
    "decimals": 18
  },
  "networkId": 18686,
  "rpc": [
    "https://18686.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mxc.com"
  ],
  "shortName": "MXCzkEVM",
  "slug": "mxc-zkevm-moonchain",
  "testnet": false
} as const satisfies Chain;