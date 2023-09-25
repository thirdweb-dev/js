import type { Chain } from "../src/types";
export default {
  "chainId": 73927,
  "chain": "MVM",
  "name": "Mixin Virtual Machine",
  "rpc": [
    "https://mixin-virtual-machine.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://geth.mvm.dev"
  ],
  "slug": "mixin-virtual-machine",
  "icon": {
    "url": "ipfs://QmeuDgSprukzfV7fi9XYHYcfmT4aZZZU7idgShtRS8Vf6V",
    "width": 471,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://mvm.dev",
  "shortName": "mvm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "mvmscan",
      "url": "https://scan.mvm.dev",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;