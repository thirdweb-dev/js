import type { Chain } from "../src/types";
export default {
  "chain": "SGB",
  "chainId": 16,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coston-explorer.flare.network",
      "standard": "EIP3091"
    },
    {
      "name": "flarescan",
      "url": "https://coston.testnet.flarescan.com",
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
    "url": "ipfs://QmV5PVhxaT3ePRHYsH3aryEHin2c49W18xW3Xg4o171iYE",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://flare.network",
  "name": "Songbird Testnet Coston",
  "nativeCurrency": {
    "name": "Coston Flare",
    "symbol": "CFLR",
    "decimals": 18
  },
  "networkId": 16,
  "rpc": [
    "https://16.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coston-api.flare.network/ext/C/rpc",
    "https://coston.enosys.global/ext/C/rpc"
  ],
  "shortName": "cflr",
  "slip44": 1,
  "slug": "songbird-testnet-coston",
  "testnet": true
} as const satisfies Chain;