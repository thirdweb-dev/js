import type { Chain } from "../src/types";
export default {
  "chainId": 666666,
  "chain": "Vision-Vpioneer",
  "name": "Vision - Vpioneer Test Chain",
  "rpc": [
    "https://vision-vpioneer-test-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://vpioneer.infragrid.v.network/ethereum/compatible"
  ],
  "slug": "vision-vpioneer-test-chain",
  "faucets": [
    "https://vpioneerfaucet.visionscan.org"
  ],
  "nativeCurrency": {
    "name": "VS",
    "symbol": "VS",
    "decimals": 18
  },
  "infoURL": "https://visionscan.org",
  "shortName": "vpioneer",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;