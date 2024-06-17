import type { Chain } from "../src/types";
export default {
  "chain": "MVM",
  "chainId": 73927,
  "explorers": [
    {
      "name": "mvmscan",
      "url": "https://scan.mvm.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://mvm.dev",
  "name": "Mixin Virtual Machine",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 73927,
  "rpc": [
    "https://73927.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://geth.mvm.dev"
  ],
  "shortName": "mvm",
  "slug": "mixin-virtual-machine",
  "testnet": false
} as const satisfies Chain;