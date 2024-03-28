import type { Chain } from "../src/types";
export default {
  "chain": "EVMCC",
  "chainId": 3100,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://immu3.io",
  "name": "Immu3 EVM",
  "nativeCurrency": {
    "name": "IMMU",
    "symbol": "IMMU",
    "decimals": 18
  },
  "networkId": 3100,
  "rpc": [
    "https://3100.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-dancebox-3043-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3043-rpc.a.dancebox.tanssi.network"
  ],
  "shortName": "Immu3",
  "slug": "immu3-evm",
  "testnet": false
} as const satisfies Chain;