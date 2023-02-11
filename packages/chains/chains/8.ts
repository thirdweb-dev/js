export default {
  "name": "Ubiq",
  "chain": "UBQ",
  "rpc": [
    "https://ubiq.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.octano.dev",
    "https://pyrus2.ubiqscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ubiq Ether",
    "symbol": "UBQ",
    "decimals": 18
  },
  "infoURL": "https://ubiqsmart.com",
  "shortName": "ubq",
  "chainId": 8,
  "networkId": 8,
  "slip44": 108,
  "explorers": [
    {
      "name": "ubiqscan",
      "url": "https://ubiqscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ubiq"
} as const;