import type { Chain } from "../types";
export default {
  "chain": "VFIEVMCC",
  "chainId": 3102,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://vulture.finance",
  "name": "Vulture EVM Beta",
  "nativeCurrency": {
    "name": "VFI",
    "symbol": "VFI",
    "decimals": 18
  },
  "networkId": 3102,
  "rpc": [
    "https://vulture-evm-beta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3102.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-dancebox-3050-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3050-rpc.a.dancebox.tanssi.network"
  ],
  "shortName": "VFI",
  "slug": "vulture-evm-beta",
  "testnet": false
} as const satisfies Chain;