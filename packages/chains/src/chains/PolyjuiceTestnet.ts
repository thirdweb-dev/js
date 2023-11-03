import type { Chain } from "../types";
export default {
  "chain": "CKB",
  "chainId": 71393,
  "explorers": [],
  "faucets": [
    "https://faucet.nervos.org/"
  ],
  "icon": {
    "url": "ipfs://QmZ5gFWUxLFqqT3DkefYfRsVksMwMTc5VvBjkbHpeFMsNe",
    "width": 1001,
    "height": 1629,
    "format": "png"
  },
  "infoURL": "https://github.com/nervosnetwork/godwoken",
  "name": "Polyjuice Testnet",
  "nativeCurrency": {
    "name": "CKB",
    "symbol": "CKB",
    "decimals": 8
  },
  "networkId": 1,
  "rpc": [
    "https://polyjuice-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://71393.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://godwoken-testnet-web3-rpc.ckbapp.dev",
    "ws://godwoken-testnet-web3-rpc.ckbapp.dev/ws"
  ],
  "shortName": "ckb",
  "slug": "polyjuice-testnet",
  "testnet": true
} as const satisfies Chain;