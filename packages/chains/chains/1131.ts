import type { Chain } from "../src/types";
export default {
  "chainId": 1131,
  "chain": "defichain-evm-testnet",
  "name": "DeFiChain EVM Network Testnet",
  "rpc": [],
  "slug": "defichain-evm-network-testnet",
  "icon": {
    "url": "ipfs://QmdR3YL9F95ajwVwfxAGoEzYwm9w7JNsPSfUPjSaQogVjK",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "DeFiChain",
    "symbol": "DFI",
    "decimals": 18
  },
  "infoURL": "https://meta.defichain.com/",
  "shortName": "DFI-T",
  "testnet": true,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;