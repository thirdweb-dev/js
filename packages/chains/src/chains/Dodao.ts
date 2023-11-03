import type { Chain } from "../types";
export default {
  "chain": "EVMCC",
  "chainId": 855456,
  "explorers": [
    {
      "name": "Dodao Explorer",
      "url": "https://tanssi-evmexplorer.netlify.app/?rpcUrl=https://fraa-dancebox-3041-rpc.a.dancebox.tanssi.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://dodao.dev/",
  "name": "Dodao",
  "nativeCurrency": {
    "name": "Dodao",
    "symbol": "DODAO",
    "decimals": 18
  },
  "networkId": 855456,
  "rpc": [
    "https://dodao.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://855456.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-dancebox-3041-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3041-rpc.a.dancebox.tanssi.network"
  ],
  "shortName": "dodao",
  "slug": "dodao",
  "testnet": false
} as const satisfies Chain;