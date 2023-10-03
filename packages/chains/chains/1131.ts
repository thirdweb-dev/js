import type { Chain } from "../src/types";
export default {
  "chain": "defichain-evm-testnet",
  "chainId": 1131,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmdR3YL9F95ajwVwfxAGoEzYwm9w7JNsPSfUPjSaQogVjK",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://meta.defichain.com/",
  "name": "DeFiChain EVM Network Testnet",
  "nativeCurrency": {
    "name": "DeFiChain",
    "symbol": "DFI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "DFI-T",
  "slug": "defichain-evm-network-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;