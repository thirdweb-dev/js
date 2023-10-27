import type { Chain } from "../src/types";
export default {
  "chain": "EVMCC",
  "chainId": 5678,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://tanssi.network",
  "name": "Tanssi EVM ContainerChain",
  "nativeCurrency": {
    "name": "Unit",
    "symbol": "Unit",
    "decimals": 18
  },
  "networkId": 5678,
  "rpc": [
    "https://tanssi-evm-containerchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5678.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network"
  ],
  "shortName": "TanssiCC",
  "slug": "tanssi-evm-containerchain",
  "testnet": false
} as const satisfies Chain;