import type { Chain } from "../src/types";
export default {
  "chainId": 71393,
  "chain": "CKB",
  "name": "Polyjuice Testnet",
  "rpc": [
    "https://polyjuice-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://godwoken-testnet-web3-rpc.ckbapp.dev",
    "ws://godwoken-testnet-web3-rpc.ckbapp.dev/ws"
  ],
  "slug": "polyjuice-testnet",
  "icon": {
    "url": "ipfs://QmZ5gFWUxLFqqT3DkefYfRsVksMwMTc5VvBjkbHpeFMsNe",
    "width": 1001,
    "height": 1629,
    "format": "png"
  },
  "faucets": [
    "https://faucet.nervos.org/"
  ],
  "nativeCurrency": {
    "name": "CKB",
    "symbol": "CKB",
    "decimals": 8
  },
  "infoURL": "https://github.com/nervosnetwork/godwoken",
  "shortName": "ckb",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;