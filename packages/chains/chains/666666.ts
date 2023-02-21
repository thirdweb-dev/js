export default {
  "name": "Vision - Vpioneer Test Chain",
  "chain": "Vision-Vpioneer",
  "rpc": [
    "https://vision-vpioneer-test-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://vpioneer.infragrid.v.network/ethereum/compatible"
  ],
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
  "chainId": 666666,
  "networkId": 666666,
  "slip44": 60,
  "testnet": true,
  "slug": "vision-vpioneer-test-chain"
} as const;