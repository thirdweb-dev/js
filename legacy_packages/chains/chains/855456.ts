import type { Chain } from "../src/types";
export default {
  "chain": "EVMCC",
  "chainId": 855456,
  "explorers": [
    {
      "name": "Dodao Explorer",
      "url": "https://tanssi-evmexplorer.netlify.app/?rpcUrl=https://fraa-dancebox-3041-rpc.a.dancebox.tanssi.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdWsi6mhs6Agb3LF4uycUwx2fgNmwkuAGb7JmsLPkwd3j",
        "width": 636,
        "height": 629,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdWsi6mhs6Agb3LF4uycUwx2fgNmwkuAGb7JmsLPkwd3j",
    "width": 636,
    "height": 629,
    "format": "png"
  },
  "infoURL": "https://dodao.dev/",
  "name": "Dodao",
  "nativeCurrency": {
    "name": "Dodao",
    "symbol": "DODAO",
    "decimals": 18
  },
  "networkId": 855456,
  "rpc": [
    "https://855456.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-dancebox-3041-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3041-rpc.a.dancebox.tanssi.network"
  ],
  "shortName": "dodao",
  "slug": "dodao",
  "testnet": false
} as const satisfies Chain;