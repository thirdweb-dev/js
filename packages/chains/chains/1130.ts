import type { Chain } from "../src/types";
export default {
  "chainId": 1130,
  "chain": "defichain-evm",
  "name": "DeFiChain EVM Network Mainnet",
  "rpc": [],
  "slug": "defichain-evm-network",
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
  "shortName": "DFI",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;