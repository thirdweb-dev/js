import type { Chain } from "../src/types";
export default {
  "name": "Polyjuice Testnet",
  "chain": "CKB",
  "icon": {
    "url": "ipfs://QmZ5gFWUxLFqqT3DkefYfRsVksMwMTc5VvBjkbHpeFMsNe",
    "width": 1001,
    "height": 1629,
    "format": "png"
  },
  "rpc": [
    "https://polyjuice-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://godwoken-testnet-web3-rpc.ckbapp.dev",
    "ws://godwoken-testnet-web3-rpc.ckbapp.dev/ws"
  ],
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
  "chainId": 71393,
  "networkId": 1,
  "testnet": true,
  "slug": "polyjuice-testnet"
} as const satisfies Chain;