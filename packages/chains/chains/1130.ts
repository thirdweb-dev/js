import type { Chain } from "../src/types";
export default {
  "chain": "defichain-evm",
  "chainId": 1130,
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
  "name": "DeFiChain EVM Network Mainnet",
  "nativeCurrency": {
    "name": "DeFiChain",
    "symbol": "DFI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "DFI",
  "slug": "defichain-evm-network",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;