import type { Chain } from "../src/types";
export default {
  "chain": "TANGO",
  "chainId": 5678,
  "explorers": [
    {
      "name": "BlockScout",
      "url": "https://3001-blockscout.a.dancebox.tanssi.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://docs.tanssi.network/builders/tanssi-network/networks/dancebox/demo-evm-containerchain",
  "name": "Tanssi Demo",
  "nativeCurrency": {
    "name": "TANGO",
    "symbol": "TANGO",
    "decimals": 18
  },
  "networkId": 5678,
  "rpc": [
    "https://5678.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network"
  ],
  "shortName": "tango",
  "slug": "tanssi-demo",
  "testnet": false
} as const satisfies Chain;