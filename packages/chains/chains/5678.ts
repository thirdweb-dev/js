import type { Chain } from "../src/types";
export default {
  "name": "Tanssi EVM ContainerChain",
  "chain": "EVMCC",
  "rpc": [
    "https://tanssi-evm-containerchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Unit",
    "symbol": "Unit",
    "decimals": 18
  },
  "infoURL": "https://tanssi.network",
  "shortName": "TanssiCC",
  "chainId": 5678,
  "networkId": 5678,
  "explorers": [],
  "testnet": false,
  "slug": "tanssi-evm-containerchain"
} as const satisfies Chain;