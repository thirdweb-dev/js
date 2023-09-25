import type { Chain } from "../src/types";
export default {
  "chainId": 5678,
  "chain": "EVMCC",
  "name": "Tanssi EVM ContainerChain",
  "rpc": [
    "https://tanssi-evm-containerchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network"
  ],
  "slug": "tanssi-evm-containerchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Unit",
    "symbol": "Unit",
    "decimals": 18
  },
  "infoURL": "https://tanssi.network",
  "shortName": "TanssiCC",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;