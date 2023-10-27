import type { Chain } from "../src/types";
export default {
  "chain": "Vision-Vpioneer",
  "chainId": 666666,
  "explorers": [],
  "faucets": [
    "https://vpioneerfaucet.visionscan.org"
  ],
  "infoURL": "https://visionscan.org",
  "name": "Vision - Vpioneer Test Chain",
  "nativeCurrency": {
    "name": "VS",
    "symbol": "VS",
    "decimals": 18
  },
  "networkId": 666666,
  "rpc": [
    "https://vision-vpioneer-test-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://666666.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://vpioneer.infragrid.v.network/ethereum/compatible"
  ],
  "shortName": "vpioneer",
  "slip44": 60,
  "slug": "vision-vpioneer-test-chain",
  "testnet": true
} as const satisfies Chain;