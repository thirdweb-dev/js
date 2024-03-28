import type { Chain } from "../src/types";
export default {
  "chain": "FLR",
  "chainId": 114,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coston2-explorer.flare.network",
      "standard": "EIP3091"
    },
    {
      "name": "flarescan",
      "url": "https://coston2.testnet.flarescan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.flare.network"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmSmXY36oXCLmTp1u3Z2MSrBstBFVFyQv3aGKLKf1hxB6u",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://flare.network",
  "name": "Flare Testnet Coston2",
  "nativeCurrency": {
    "name": "Coston2 Flare",
    "symbol": "C2FLR",
    "decimals": 18
  },
  "networkId": 114,
  "rpc": [
    "https://114.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coston2-api.flare.network/ext/C/rpc",
    "https://flaretestnet-bundler.etherspot.io",
    "https://coston2.enosys.global/ext/C/rpc"
  ],
  "shortName": "c2flr",
  "slip44": 1,
  "slug": "flare-testnet-coston2",
  "testnet": true
} as const satisfies Chain;